import React, { FC, useEffect, useState, ReactText } from "react";
import { Table } from "vtex.styleguide";
import { Query } from "react-apollo";
import pessoas from "./graphql/queries/pessoas.gql";

interface PessoasData {
  usuarios: {
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

  const [tableLen, setTableLen] = useState(5)
  const [from, setFrom] = useState(0)
  const [to, setTo] = useState(tableLen)

  return (
    <div>
      <PessoasQuery query={pessoas} variables={{from, to}}>
        {({ data }) => {
          if (data && data.usuarios) {
            const info = data.usuarios.map(x => {
              if (x.nome === "Anita") {
                return {
                  photo: x.photo,
                  nome: x.nome,
                  numeroDeAmigos: -20,
                  idade: x.idade
                };
              } else {
                return {
                  photo: x.photo,
                  nome: x.nome,
                  numeroDeAmigos: x.amigos.length,
                  idade: x.idade
                };
              }
            });

            console.log(info)
            return (
              <Table
                density={'low'}
                schema={{
                  properties: {
                    photo: {
                      cellRenderer: ({ cellData } : any) => (
                        <img src = {cellData} style={{height: 70, width: 70}}/>
                      ),
                      headerRenderer: (): null => null,
                      width: 100
                    },
                    nome: {
                      title: "Nome"
                    },
                    numeroDeAmigos: {
                      title: "Número de amigos"
                    },
                    idade: {
                      title: "Idade"
                    }
                  }
                }}
                items={info}
                pagination={{
                  onNextClick: () => {},
                  onPrevClick: () => {},
                  currentItemFrom: from,
                  currentItemTo: to,
                  onRowsChange: (e, value: number | string) => {
                    setFrom(0)
                    const v = typeof value == "string" ? parseInt(value) : value
                    setTableLen(v)
                    setTo(v)
                  },
                  textShowRows: 'Show rows',
                  textOf: 'of',
                  totalItems: 0,
                  rowsOptions: [1,2,3,4,5,6,7,8,9,10],
                  selectedOption: tableLen
                }}
              />
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
