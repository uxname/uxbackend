module.exports = {
        typeDefs: /* GraphQL */ `type ActivationCode {
  id: ID!
  email: String!
  valid_until: DateTime!
  code: String!
}

type ActivationCodeConnection {
  pageInfo: PageInfo!
  edges: [ActivationCodeEdge]!
  aggregate: AggregateActivationCode!
}

input ActivationCodeCreateInput {
  email: String!
  valid_until: DateTime!
  code: String!
}

type ActivationCodeEdge {
  node: ActivationCode!
  cursor: String!
}

enum ActivationCodeOrderByInput {
  id_ASC
  id_DESC
  email_ASC
  email_DESC
  valid_until_ASC
  valid_until_DESC
  code_ASC
  code_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type ActivationCodePreviousValues {
  id: ID!
  email: String!
  valid_until: DateTime!
  code: String!
}

type ActivationCodeSubscriptionPayload {
  mutation: MutationType!
  node: ActivationCode
  updatedFields: [String!]
  previousValues: ActivationCodePreviousValues
}

input ActivationCodeSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: ActivationCodeWhereInput
  AND: [ActivationCodeSubscriptionWhereInput!]
  OR: [ActivationCodeSubscriptionWhereInput!]
  NOT: [ActivationCodeSubscriptionWhereInput!]
}

input ActivationCodeUpdateInput {
  email: String
  valid_until: DateTime
  code: String
}

input ActivationCodeWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  valid_until: DateTime
  valid_until_not: DateTime
  valid_until_in: [DateTime!]
  valid_until_not_in: [DateTime!]
  valid_until_lt: DateTime
  valid_until_lte: DateTime
  valid_until_gt: DateTime
  valid_until_gte: DateTime
  code: String
  code_not: String
  code_in: [String!]
  code_not_in: [String!]
  code_lt: String
  code_lte: String
  code_gt: String
  code_gte: String
  code_contains: String
  code_not_contains: String
  code_starts_with: String
  code_not_starts_with: String
  code_ends_with: String
  code_not_ends_with: String
  AND: [ActivationCodeWhereInput!]
  OR: [ActivationCodeWhereInput!]
  NOT: [ActivationCodeWhereInput!]
}

input ActivationCodeWhereUniqueInput {
  id: ID
  email: String
}

type AggregateActivationCode {
  count: Int!
}

type AggregateCategory {
  count: Int!
}

type AggregateProduct {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type BatchPayload {
  count: Long!
}

type Category {
  id: ID!
  title: String!
  description: String
  subcategories(where: CategoryWhereInput, orderBy: CategoryOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Category!]
  products(where: ProductWhereInput, orderBy: ProductOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Product!]
}

type CategoryConnection {
  pageInfo: PageInfo!
  edges: [CategoryEdge]!
  aggregate: AggregateCategory!
}

input CategoryCreateInput {
  title: String!
  description: String
  subcategories: CategoryCreateManyInput
  products: ProductCreateManyWithoutCategoriesInput
}

input CategoryCreateManyInput {
  create: [CategoryCreateInput!]
  connect: [CategoryWhereUniqueInput!]
}

input CategoryCreateManyWithoutProductsInput {
  create: [CategoryCreateWithoutProductsInput!]
  connect: [CategoryWhereUniqueInput!]
}

input CategoryCreateWithoutProductsInput {
  title: String!
  description: String
  subcategories: CategoryCreateManyInput
}

type CategoryEdge {
  node: Category!
  cursor: String!
}

enum CategoryOrderByInput {
  id_ASC
  id_DESC
  title_ASC
  title_DESC
  description_ASC
  description_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type CategoryPreviousValues {
  id: ID!
  title: String!
  description: String
}

type CategorySubscriptionPayload {
  mutation: MutationType!
  node: Category
  updatedFields: [String!]
  previousValues: CategoryPreviousValues
}

input CategorySubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: CategoryWhereInput
  AND: [CategorySubscriptionWhereInput!]
  OR: [CategorySubscriptionWhereInput!]
  NOT: [CategorySubscriptionWhereInput!]
}

input CategoryUpdateDataInput {
  title: String
  description: String
  subcategories: CategoryUpdateManyInput
  products: ProductUpdateManyWithoutCategoriesInput
}

input CategoryUpdateInput {
  title: String
  description: String
  subcategories: CategoryUpdateManyInput
  products: ProductUpdateManyWithoutCategoriesInput
}

input CategoryUpdateManyInput {
  create: [CategoryCreateInput!]
  update: [CategoryUpdateWithWhereUniqueNestedInput!]
  upsert: [CategoryUpsertWithWhereUniqueNestedInput!]
  delete: [CategoryWhereUniqueInput!]
  connect: [CategoryWhereUniqueInput!]
  disconnect: [CategoryWhereUniqueInput!]
}

input CategoryUpdateManyWithoutProductsInput {
  create: [CategoryCreateWithoutProductsInput!]
  delete: [CategoryWhereUniqueInput!]
  connect: [CategoryWhereUniqueInput!]
  disconnect: [CategoryWhereUniqueInput!]
  update: [CategoryUpdateWithWhereUniqueWithoutProductsInput!]
  upsert: [CategoryUpsertWithWhereUniqueWithoutProductsInput!]
}

input CategoryUpdateWithoutProductsDataInput {
  title: String
  description: String
  subcategories: CategoryUpdateManyInput
}

input CategoryUpdateWithWhereUniqueNestedInput {
  where: CategoryWhereUniqueInput!
  data: CategoryUpdateDataInput!
}

input CategoryUpdateWithWhereUniqueWithoutProductsInput {
  where: CategoryWhereUniqueInput!
  data: CategoryUpdateWithoutProductsDataInput!
}

input CategoryUpsertWithWhereUniqueNestedInput {
  where: CategoryWhereUniqueInput!
  update: CategoryUpdateDataInput!
  create: CategoryCreateInput!
}

input CategoryUpsertWithWhereUniqueWithoutProductsInput {
  where: CategoryWhereUniqueInput!
  update: CategoryUpdateWithoutProductsDataInput!
  create: CategoryCreateWithoutProductsInput!
}

input CategoryWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  title: String
  title_not: String
  title_in: [String!]
  title_not_in: [String!]
  title_lt: String
  title_lte: String
  title_gt: String
  title_gte: String
  title_contains: String
  title_not_contains: String
  title_starts_with: String
  title_not_starts_with: String
  title_ends_with: String
  title_not_ends_with: String
  description: String
  description_not: String
  description_in: [String!]
  description_not_in: [String!]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  subcategories_every: CategoryWhereInput
  subcategories_some: CategoryWhereInput
  subcategories_none: CategoryWhereInput
  products_every: ProductWhereInput
  products_some: ProductWhereInput
  products_none: ProductWhereInput
  AND: [CategoryWhereInput!]
  OR: [CategoryWhereInput!]
  NOT: [CategoryWhereInput!]
}

input CategoryWhereUniqueInput {
  id: ID
}

scalar DateTime

scalar Long

type Mutation {
  createActivationCode(data: ActivationCodeCreateInput!): ActivationCode!
  updateActivationCode(data: ActivationCodeUpdateInput!, where: ActivationCodeWhereUniqueInput!): ActivationCode
  updateManyActivationCodes(data: ActivationCodeUpdateInput!, where: ActivationCodeWhereInput): BatchPayload!
  upsertActivationCode(where: ActivationCodeWhereUniqueInput!, create: ActivationCodeCreateInput!, update: ActivationCodeUpdateInput!): ActivationCode!
  deleteActivationCode(where: ActivationCodeWhereUniqueInput!): ActivationCode
  deleteManyActivationCodes(where: ActivationCodeWhereInput): BatchPayload!
  createCategory(data: CategoryCreateInput!): Category!
  updateCategory(data: CategoryUpdateInput!, where: CategoryWhereUniqueInput!): Category
  updateManyCategories(data: CategoryUpdateInput!, where: CategoryWhereInput): BatchPayload!
  upsertCategory(where: CategoryWhereUniqueInput!, create: CategoryCreateInput!, update: CategoryUpdateInput!): Category!
  deleteCategory(where: CategoryWhereUniqueInput!): Category
  deleteManyCategories(where: CategoryWhereInput): BatchPayload!
  createProduct(data: ProductCreateInput!): Product!
  updateProduct(data: ProductUpdateInput!, where: ProductWhereUniqueInput!): Product
  updateManyProducts(data: ProductUpdateInput!, where: ProductWhereInput): BatchPayload!
  upsertProduct(where: ProductWhereUniqueInput!, create: ProductCreateInput!, update: ProductUpdateInput!): Product!
  deleteProduct(where: ProductWhereUniqueInput!): Product
  deleteManyProducts(where: ProductWhereInput): BatchPayload!
  createUser(data: UserCreateInput!): User!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateManyUsers(data: UserUpdateInput!, where: UserWhereInput): BatchPayload!
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  deleteUser(where: UserWhereUniqueInput!): User
  deleteManyUsers(where: UserWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Product {
  id: ID!
  title: String!
  description: String
  categories(where: CategoryWhereInput, orderBy: CategoryOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Category!]
}

type ProductConnection {
  pageInfo: PageInfo!
  edges: [ProductEdge]!
  aggregate: AggregateProduct!
}

input ProductCreateInput {
  title: String!
  description: String
  categories: CategoryCreateManyWithoutProductsInput
}

input ProductCreateManyWithoutCategoriesInput {
  create: [ProductCreateWithoutCategoriesInput!]
  connect: [ProductWhereUniqueInput!]
}

input ProductCreateWithoutCategoriesInput {
  title: String!
  description: String
}

type ProductEdge {
  node: Product!
  cursor: String!
}

enum ProductOrderByInput {
  id_ASC
  id_DESC
  title_ASC
  title_DESC
  description_ASC
  description_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type ProductPreviousValues {
  id: ID!
  title: String!
  description: String
}

type ProductSubscriptionPayload {
  mutation: MutationType!
  node: Product
  updatedFields: [String!]
  previousValues: ProductPreviousValues
}

input ProductSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: ProductWhereInput
  AND: [ProductSubscriptionWhereInput!]
  OR: [ProductSubscriptionWhereInput!]
  NOT: [ProductSubscriptionWhereInput!]
}

input ProductUpdateInput {
  title: String
  description: String
  categories: CategoryUpdateManyWithoutProductsInput
}

input ProductUpdateManyWithoutCategoriesInput {
  create: [ProductCreateWithoutCategoriesInput!]
  delete: [ProductWhereUniqueInput!]
  connect: [ProductWhereUniqueInput!]
  disconnect: [ProductWhereUniqueInput!]
  update: [ProductUpdateWithWhereUniqueWithoutCategoriesInput!]
  upsert: [ProductUpsertWithWhereUniqueWithoutCategoriesInput!]
}

input ProductUpdateWithoutCategoriesDataInput {
  title: String
  description: String
}

input ProductUpdateWithWhereUniqueWithoutCategoriesInput {
  where: ProductWhereUniqueInput!
  data: ProductUpdateWithoutCategoriesDataInput!
}

input ProductUpsertWithWhereUniqueWithoutCategoriesInput {
  where: ProductWhereUniqueInput!
  update: ProductUpdateWithoutCategoriesDataInput!
  create: ProductCreateWithoutCategoriesInput!
}

input ProductWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  title: String
  title_not: String
  title_in: [String!]
  title_not_in: [String!]
  title_lt: String
  title_lte: String
  title_gt: String
  title_gte: String
  title_contains: String
  title_not_contains: String
  title_starts_with: String
  title_not_starts_with: String
  title_ends_with: String
  title_not_ends_with: String
  description: String
  description_not: String
  description_in: [String!]
  description_not_in: [String!]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  categories_every: CategoryWhereInput
  categories_some: CategoryWhereInput
  categories_none: CategoryWhereInput
  AND: [ProductWhereInput!]
  OR: [ProductWhereInput!]
  NOT: [ProductWhereInput!]
}

input ProductWhereUniqueInput {
  id: ID
}

type Query {
  activationCode(where: ActivationCodeWhereUniqueInput!): ActivationCode
  activationCodes(where: ActivationCodeWhereInput, orderBy: ActivationCodeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [ActivationCode]!
  activationCodesConnection(where: ActivationCodeWhereInput, orderBy: ActivationCodeOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ActivationCodeConnection!
  category(where: CategoryWhereUniqueInput!): Category
  categories(where: CategoryWhereInput, orderBy: CategoryOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Category]!
  categoriesConnection(where: CategoryWhereInput, orderBy: CategoryOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): CategoryConnection!
  product(where: ProductWhereUniqueInput!): Product
  products(where: ProductWhereInput, orderBy: ProductOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Product]!
  productsConnection(where: ProductWhereInput, orderBy: ProductOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ProductConnection!
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  node(id: ID!): Node
}

type Subscription {
  activationCode(where: ActivationCodeSubscriptionWhereInput): ActivationCodeSubscriptionPayload
  category(where: CategorySubscriptionWhereInput): CategorySubscriptionPayload
  product(where: ProductSubscriptionWhereInput): ProductSubscriptionPayload
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
}

type User {
  id: ID!
  email: String!
  roles: [UserRole!]!
  password_hash: String!
  password_salt: String!
  avatar: String
  last_login_date: DateTime
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  email: String!
  roles: UserCreaterolesInput
  password_hash: String!
  password_salt: String!
  avatar: String
  last_login_date: DateTime
}

input UserCreaterolesInput {
  set: [UserRole!]
}

type UserEdge {
  node: User!
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  email_ASC
  email_DESC
  password_hash_ASC
  password_hash_DESC
  password_salt_ASC
  password_salt_DESC
  avatar_ASC
  avatar_DESC
  last_login_date_ASC
  last_login_date_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type UserPreviousValues {
  id: ID!
  email: String!
  roles: [UserRole!]!
  password_hash: String!
  password_salt: String!
  avatar: String
  last_login_date: DateTime
}

enum UserRole {
  USER
  MODERATOR
  ADMIN
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: UserWhereInput
  AND: [UserSubscriptionWhereInput!]
  OR: [UserSubscriptionWhereInput!]
  NOT: [UserSubscriptionWhereInput!]
}

input UserUpdateInput {
  email: String
  roles: UserUpdaterolesInput
  password_hash: String
  password_salt: String
  avatar: String
  last_login_date: DateTime
}

input UserUpdaterolesInput {
  set: [UserRole!]
}

input UserWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  password_hash: String
  password_hash_not: String
  password_hash_in: [String!]
  password_hash_not_in: [String!]
  password_hash_lt: String
  password_hash_lte: String
  password_hash_gt: String
  password_hash_gte: String
  password_hash_contains: String
  password_hash_not_contains: String
  password_hash_starts_with: String
  password_hash_not_starts_with: String
  password_hash_ends_with: String
  password_hash_not_ends_with: String
  password_salt: String
  password_salt_not: String
  password_salt_in: [String!]
  password_salt_not_in: [String!]
  password_salt_lt: String
  password_salt_lte: String
  password_salt_gt: String
  password_salt_gte: String
  password_salt_contains: String
  password_salt_not_contains: String
  password_salt_starts_with: String
  password_salt_not_starts_with: String
  password_salt_ends_with: String
  password_salt_not_ends_with: String
  avatar: String
  avatar_not: String
  avatar_in: [String!]
  avatar_not_in: [String!]
  avatar_lt: String
  avatar_lte: String
  avatar_gt: String
  avatar_gte: String
  avatar_contains: String
  avatar_not_contains: String
  avatar_starts_with: String
  avatar_not_starts_with: String
  avatar_ends_with: String
  avatar_not_ends_with: String
  last_login_date: DateTime
  last_login_date_not: DateTime
  last_login_date_in: [DateTime!]
  last_login_date_not_in: [DateTime!]
  last_login_date_lt: DateTime
  last_login_date_lte: DateTime
  last_login_date_gt: DateTime
  last_login_date_gte: DateTime
  AND: [UserWhereInput!]
  OR: [UserWhereInput!]
  NOT: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  email: String
  password_salt: String
}
`
      }
    