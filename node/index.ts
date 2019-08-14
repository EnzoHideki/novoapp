import { Service } from '@vtex/api'

var listaDeUsuarios = [
    {photo: "https://avatars3.githubusercontent.com/u/3827456?s=460&v=4", id: "0", nome: "Artur", friends: [1,3,4], ano: 1999}, 
    {photo: "https://avatars1.githubusercontent.com/u/8623116?s=460&v=4", id: "1", nome:"Anita", friends: [], ano: 1997}, 
    {photo: "https://avatars0.githubusercontent.com/u/7076941?s=460&v=4", id: "2", nome: "Enzo", friends: [], ano: 1995}, 
    {photo: "https://avatars1.githubusercontent.com/u/36630479?s=400&v=4", id: "3", nome: "Laercio", friends: [2,3], ano: 1996}, 
    {photo: "https://avatars2.githubusercontent.com/u/34658092?s=400&v=4", id: "4", nome: "Davi", friends: [1,4], ano: 1998},
    {photo: "https://avatars3.githubusercontent.com/u/3827456?s=460&v=4", id: "5", nome: "Artur", friends: [1,3,4], ano: 1999}, 
    {photo: "https://avatars1.githubusercontent.com/u/8623116?s=460&v=4", id: "6", nome:"Anita", friends: [], ano: 1997}, 
    {photo: "https://avatars0.githubusercontent.com/u/7076941?s=460&v=4", id: "7", nome: "Enzo", friends: [], ano: 1995}, 
    {photo: "https://avatars1.githubusercontent.com/u/36630479?s=400&v=4", id: "8", nome: "Laercio", friends: [2,3], ano: 1996}, 
    {photo: "https://avatars2.githubusercontent.com/u/34658092?s=400&v=4", id: "9", nome: "Davi", friends: [1,4], ano: 1998}
]

const sortASC = (a: any, b: any) => {
    return a.friends.length < b.friends.length ? -1 : a.friends.length > b.friends.length ? 1 : 0
}
const sortDESC = (a: any, b: any) => {
    return a.friends.length < b.friends.length ? 1 : a.friends.length > b.friends.length ? -1 : 0
}

export default new Service({
    graphql: {
        resolvers: {
            Query: {
                usuario: (_, args) => (search(args.id)),
                usuarios: (_, args) => {
                    const {from, to, ord} = args

                    if (ord === "ASC") {
                        listaDeUsuarios.sort(sortASC)
                    } else if (ord === "DESC") {
                        listaDeUsuarios.sort(sortDESC)
                    }
                    
                    return listaDeUsuarios.slice(from, to)
                },
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
                },
                alteraIdade: (_, args) => {
                    console.log(listaDeUsuarios[parseInt(args.id)].ano)
                    listaDeUsuarios[parseInt(args.id)].ano--
                    console.log(listaDeUsuarios[parseInt(args.id)].ano)
                    return listaDeUsuarios[parseInt(args.id)].ano
                }
            }
        }
    }
})


const search = (id: string) => listaDeUsuarios.find((usuario) => usuario.id == id)