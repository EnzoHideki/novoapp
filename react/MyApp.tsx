import React, { FC, useEffect } from "react";
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

  return (
    <div>
      <PessoasQuery query={pessoas}>
        {({ data }) => {
          if (data && data.usuarios) {
            const info = data.usuarios.map(x => {
              console.log(x.photo)
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
