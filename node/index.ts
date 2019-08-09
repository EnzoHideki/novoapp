import { Service } from '@vtex/api'

const listaDeUsuarios = [
    {photo: "https://avatars3.githubusercontent.com/u/3827456?s=460&v=4", id: "1", nome: "Artur", friends: [1,3,4], ano: 1999}, 
    {photo: "https://avatars1.githubusercontent.com/u/8623116?s=460&v=4", id: "2", nome:"Anita", friends: [], ano: 1997}, 
    {photo: "https://avatars0.githubusercontent.com/u/7076941?s=460&v=4", id: "3", nome: "Enzo", friends: [], ano: 1995}, 
    {photo: "https://avatars1.githubusercontent.com/u/36630479?s=400&v=4", id: "4", nome: "Laercio", friends: [2,3], ano: 1996}, 
    {photo: "https://avatars2.githubusercontent.com/u/34658092?s=400&v=4", id: "5", nome: "Davi", friends: [1,4], ano: 1998}
]

export default new Service({
    graphql: {
        resolvers: {
            Query: {
                usuario: (_, args) => (search(args.id)),
                usuarios: () => listaDeUsuarios,
            },
            Usuario: {
                amigos: (parent) => parent.friends.map((id: string) => search(id)),
                idade: (parent) => 2019-parent.ano,
            },
            Mutation: {
                criaUsuario: (_, args) => {
                    var index = listaDeUsuarios.length + 1
                    listaDeUsuarios.push({photo: "", id: index.toString(), nome: args.input.nome, friends: [], ano: 2000})
                    return {
                        usuario: search(index.toString())
                    }
                }
            }
        }
    }
})


const search = (id: string) => listaDeUsuarios.find((usuario) => usuario.id == id)