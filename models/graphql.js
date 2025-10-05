// const {gql}  =  require('@apollo/server');

const typeDefs = `#graphql
    type User {
        _id: ID!,
        fullName: String!,
        email: String!,
        profileImageURL: String!,
        role: String!,
        createdAt: String!,
        updatedAt: String!,
        salt: String!,
        
    }
    type Blog{
        _id: ID!,
        title: String!,
        image_url: String!,
        content: String!,
        author: User!,
        createdAt: String!,
        updatedAt: String!,
        
    }
    type Comment{
        _id: ID!,
        user: User!,
        blogID: Blog!,
        text: String!,
        createdAt: String!,
        updatedAt: String!,
        
    }   
    type Query{
        users: [User!]!,
        comments: [Comment!]!,
        blogs: [Blog!]!,
        blog(id: ID!): Blog!
    }`;

module.exports = typeDefs;