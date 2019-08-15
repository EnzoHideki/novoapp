import React, { FC, useEffect, useState } from "react"
import { Table, Box } from "vtex.styleguide"
import { Query } from "react-apollo"
import { useRuntime } from 'vtex.render-runtime'
import pessoas from "./graphql/queries/pessoas.gql"

interface PessoasData {
  usuarios: {
    id: string,
    photo: string;
    nome: string;
    amigos: {
      nome: string;
    }[];
    idade: number;
  }[];
}

class PessoasQuery extends Query<PessoasData> {}

const MyApp: FC = () => {
  useEffect(() => {
    window.postMessage({ action: { type: "STOP_LOADING" } }, "*");
  });

  const [tableLength, setTableLength] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentItemFrom, setCurrentItemFrom] = useState(0);
  const [currentItemTo, setCurrentItemTo] = useState(tableLength);
  const [sortOrder, setSortOrder] = useState(null);
  const [sortedBy, setSortedBy] = useState(null);

  const handleNextClick = () => {
    const newPage = currentPage + 1;
    const itemFrom = currentItemTo;
    const itemTo = tableLength * (newPage + 1);

    goToPage(newPage, itemFrom, itemTo);
  };

  const handlePrevClick = () => {
    if (currentPage === 0) return;

    const newPage = currentPage - 1;
    const itemFrom = currentItemFrom - tableLength;
    const itemTo = currentItemFrom;

    goToPage(newPage, itemFrom, itemTo);
  };

  const goToPage = (
    currentPage: any,
    currentItemFrom: any,
    currentItemTo: any
  ) => {
    setCurrentPage(currentPage);
    setCurrentItemTo(currentItemTo);
    setCurrentItemFrom(currentItemFrom);
  };

  const handleRowsChange = (e: any, value: string | number) => {
    const v = typeof value == "string" ? parseInt(value) : value;
    const start = currentItemFrom;

    setTableLength(v);
    setCurrentPage(Math.floor(start / v));
    setCurrentItemFrom(v * Math.floor(start / v));
    setCurrentItemTo(v * Math.floor(start / v) + v);
  };

  const { navigate } = useRuntime();

  return (
    <div>
      <PessoasQuery
        query={pessoas}
        variables={{ from: currentItemFrom, to: currentItemTo, ord: sortOrder }}
      >
        {({ data }) => {
          // console.log(data)
          if (data && data.usuarios) {
            // console.log(data.usuarios)
            var info = data.usuarios.map(x => {
              return {
                id: x.id,
                photo: x.photo,
                nome: x.nome,
                numeroDeAmigos: x.amigos.length,
                idade: x.idade
              };
            });

            return (
              <div className={"mw7"}>
                <Box>
                  <Table
                    density={"low"}
                    schema={{
                      properties: {
                        photo: {
                          cellRenderer: ({ cellData }: any) => (
                            <img
                              src={cellData}
                              style={{ height: 70, width: 70 }}
                            />
                          ),
                          headerRenderer: (): null => null,
                          width: 100
                        },
                        nome: {
                          title: "Nome"
                        },
                        numeroDeAmigos: {
                          title: "Número de amigos",
                          sortable: true
                        },
                        idade: {
                          title: "Idade"
                        }
                      }
                    }}
                    items={info}
                    pagination={{
                      onNextClick: handleNextClick,
                      onPrevClick: handlePrevClick,
                      currentItemFrom: currentItemFrom + 1,
                      currentItemTo: currentItemTo,
                      onRowsChange: handleRowsChange,
                      textShowRows: "Show rows",
                      textOf: "of",
                      totalItems: 10,
                      rowsOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                      selectedOption: tableLength
                    }}
                    sort={{
                      sortedBy: sortedBy,
                      sortOrder: sortOrder
                    }}
                    onSort={({sortedBy, sortOrder}: {sortedBy: any, sortOrder: any}) => {
                      setSortOrder(sortOrder)
                      setSortedBy(sortedBy)
                    }}
                    onRowClick={({ rowData }: { rowData: any }) => {
                      navigate({
                        page: "nomedoapp.outrapag",
                        params: { userId: rowData.id }
                      })
                    }}
                  />
                </Box>
              </div>
            );
          } else {
            return <div></div>;
          }
        }}
      </PessoasQuery>
    </div>
  );
};

export default MyApp;
