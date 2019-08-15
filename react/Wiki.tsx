import React, { FC, useEffect } from "react"
import pessoa from "./graphql/queries/pessoa.gql"
import alteraidade from "./graphql/queries/alteraidade.gql"
import { Query, Mutation } from "react-apollo"
import { useRuntime } from "vtex.render-runtime"

interface Props {
  params: {
    userId: string
  }
}

interface PessoasData {
  usuario: {
    id: string,
    photo: string;
    nome: string;
    amigos: {
      nome: string;
    }[];
    idade: number;
  };
}

class PessoasQuery extends Query<PessoasData> {}

const friendList = (a: any) => {
  var res = ""
  for (var i=0; i<a.length; i++) {
    res += a[i].nome + " "
  }
  return res
}

const Wiki: FC<Props> = ({ params: { userId } }) => {
  const {setQuery} = useRuntime()

  useEffect(()=> {
    setQuery({banana: 'sim'})
  }, [])
  // console.log(aa)

  return (
    <PessoasQuery 
      query={pessoa} 
      variables={{id: userId}}
    >
      {({data}) => {
        // console.log(data)
        
        if (data && data.usuario) {
          // console.log(data.usuario.amigos)
          return (
            <>
              <img src={data.usuario.photo} height={200} width={200}></img>
              <div>Nome: {data.usuario.nome}</div>
              <div>Amigos: {friendList(data.usuario.amigos)}</div>
              <div>Idade: {data.usuario.idade}</div>

              <Mutation 
                mutation={alteraidade}
                update={(cache : any) => {
                  const { usuario } = cache.readQuery({ 
                    query : pessoa,
                    variables: {id : userId}
                  })
                  cache.writeQuery({
                    query : pessoa,
                    variables: {id : userId},
                    data: { usuario: { ...usuario, idade: usuario.idade+1 } },
                  })
                }}
              >
                {(alteraIdade : any) => {
                    return <button onClick={() => {
                      alteraIdade({ variables: { id: userId }})
                      setQuery({ userId })
                    }}>aumentar a idade</button>
                }}
              </Mutation>
            </>
          );
        } else {
          return <div></div>
        }
      }}
    </PessoasQuery>
  );
}

export default Wiki