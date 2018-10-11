// Code generated by Prisma (prisma@1.18.0). DO NOT EDIT.
// Please don't change this file manually but run `prisma generate` to update it.
// For more information, please read the docs: https://www.prisma.io/docs/prisma-client/

import { DocumentNode, GraphQLSchema } from "graphql";
import { IResolvers } from "graphql-tools/dist/Interfaces";
import { makePrismaClientClass, BaseClientOptions } from "prisma-client-lib";
import { typeDefs } from "./prisma-schema";

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

export interface Exists {
  category: (where?: CategoryWhereInput) => Promise<boolean>;
  product: (where?: ProductWhereInput) => Promise<boolean>;
  user: (where?: UserWhereInput) => Promise<boolean>;
}

export interface Node {}

export type FragmentableArray<T> = Promise<Array<T>> & Fragmentable;

export interface Fragmentable {
  $fragment<T>(fragment: string | DocumentNode): Promise<T>;
}

export interface Prisma {
  $exists: Exists;
  $graphql: <T = any>(
    query: string,
    variables?: { [key: string]: any }
  ) => Promise<T>;
  $getAbstractResolvers(filterSchema?: GraphQLSchema | string): IResolvers;

  /**
   * Queries
   */

  category: (where: CategoryWhereUniqueInput) => Category;
  categories: (
    args?: {
      where?: CategoryWhereInput;
      orderBy?: CategoryOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => FragmentableArray<CategoryNode>;
  categoriesConnection: (
    args?: {
      where?: CategoryWhereInput;
      orderBy?: CategoryOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => CategoryConnection;
  product: (where: ProductWhereUniqueInput) => Product;
  products: (
    args?: {
      where?: ProductWhereInput;
      orderBy?: ProductOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => FragmentableArray<ProductNode>;
  productsConnection: (
    args?: {
      where?: ProductWhereInput;
      orderBy?: ProductOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => ProductConnection;
  user: (where: UserWhereUniqueInput) => User;
  users: (
    args?: {
      where?: UserWhereInput;
      orderBy?: UserOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => FragmentableArray<UserNode>;
  usersConnection: (
    args?: {
      where?: UserWhereInput;
      orderBy?: UserOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => UserConnection;
  node: (args: { id: ID_Output }) => Node;

  /**
   * Mutations
   */

  createCategory: (data: CategoryCreateInput) => Category;
  updateCategory: (
    args: { data: CategoryUpdateInput; where: CategoryWhereUniqueInput }
  ) => Category;
  updateManyCategories: (
    args: { data: CategoryUpdateInput; where?: CategoryWhereInput }
  ) => BatchPayload;
  upsertCategory: (
    args: {
      where: CategoryWhereUniqueInput;
      create: CategoryCreateInput;
      update: CategoryUpdateInput;
    }
  ) => Category;
  deleteCategory: (where: CategoryWhereUniqueInput) => Category;
  deleteManyCategories: (where?: CategoryWhereInput) => BatchPayload;
  createProduct: (data: ProductCreateInput) => Product;
  updateProduct: (
    args: { data: ProductUpdateInput; where: ProductWhereUniqueInput }
  ) => Product;
  updateManyProducts: (
    args: { data: ProductUpdateInput; where?: ProductWhereInput }
  ) => BatchPayload;
  upsertProduct: (
    args: {
      where: ProductWhereUniqueInput;
      create: ProductCreateInput;
      update: ProductUpdateInput;
    }
  ) => Product;
  deleteProduct: (where: ProductWhereUniqueInput) => Product;
  deleteManyProducts: (where?: ProductWhereInput) => BatchPayload;
  createUser: (data: UserCreateInput) => User;
  updateUser: (
    args: { data: UserUpdateInput; where: UserWhereUniqueInput }
  ) => User;
  updateManyUsers: (
    args: { data: UserUpdateInput; where?: UserWhereInput }
  ) => BatchPayload;
  upsertUser: (
    args: {
      where: UserWhereUniqueInput;
      create: UserCreateInput;
      update: UserUpdateInput;
    }
  ) => User;
  deleteUser: (where: UserWhereUniqueInput) => User;
  deleteManyUsers: (where?: UserWhereInput) => BatchPayload;

  /**
   * Subscriptions
   */

  $subscribe: Subscription;
}

export interface Subscription {
  category: (
    where?: CategorySubscriptionWhereInput
  ) => CategorySubscriptionPayloadSubscription;
  product: (
    where?: ProductSubscriptionWhereInput
  ) => ProductSubscriptionPayloadSubscription;
  user: (
    where?: UserSubscriptionWhereInput
  ) => UserSubscriptionPayloadSubscription;
}

export interface ClientConstructor<T> {
  new (options?: BaseClientOptions): T;
}

/**
 * Types
 */

export type CategoryOrderByInput =
  | "id_ASC"
  | "id_DESC"
  | "title_ASC"
  | "title_DESC"
  | "description_ASC"
  | "description_DESC"
  | "createdAt_ASC"
  | "createdAt_DESC"
  | "updatedAt_ASC"
  | "updatedAt_DESC";

export type ProductOrderByInput =
  | "id_ASC"
  | "id_DESC"
  | "title_ASC"
  | "title_DESC"
  | "description_ASC"
  | "description_DESC"
  | "createdAt_ASC"
  | "createdAt_DESC"
  | "updatedAt_ASC"
  | "updatedAt_DESC";

export type UserRole = "REGISTERED_USER" | "ADMIN";

export type UserOrderByInput =
  | "id_ASC"
  | "id_DESC"
  | "username_ASC"
  | "username_DESC"
  | "createdAt_ASC"
  | "createdAt_DESC"
  | "updatedAt_ASC"
  | "updatedAt_DESC";

export type MutationType = "CREATED" | "UPDATED" | "DELETED";

export interface CategoryUpdateInput {
  title?: String;
  description?: String;
  subcategories?: CategoryUpdateManyInput;
  products?: ProductUpdateManyWithoutCategoriesInput;
}

export type CategoryWhereUniqueInput = AtLeastOne<{
  id: ID_Input;
}>;

export interface ProductUpdateInput {
  title?: String;
  description?: String;
  categories?: CategoryUpdateManyWithoutProductsInput;
}

export interface CategoryUpsertWithWhereUniqueNestedInput {
  where: CategoryWhereUniqueInput;
  update: CategoryUpdateDataInput;
  create: CategoryCreateInput;
}

export interface CategoryCreateWithoutProductsInput {
  title: String;
  description?: String;
  subcategories?: CategoryCreateManyInput;
}

export interface ProductUpdateManyWithoutCategoriesInput {
  create?:
    | ProductCreateWithoutCategoriesInput[]
    | ProductCreateWithoutCategoriesInput;
  delete?: ProductWhereUniqueInput[] | ProductWhereUniqueInput;
  connect?: ProductWhereUniqueInput[] | ProductWhereUniqueInput;
  disconnect?: ProductWhereUniqueInput[] | ProductWhereUniqueInput;
  update?:
    | ProductUpdateWithWhereUniqueWithoutCategoriesInput[]
    | ProductUpdateWithWhereUniqueWithoutCategoriesInput;
  upsert?:
    | ProductUpsertWithWhereUniqueWithoutCategoriesInput[]
    | ProductUpsertWithWhereUniqueWithoutCategoriesInput;
}

export interface CategoryCreateManyWithoutProductsInput {
  create?:
    | CategoryCreateWithoutProductsInput[]
    | CategoryCreateWithoutProductsInput;
  connect?: CategoryWhereUniqueInput[] | CategoryWhereUniqueInput;
}

export interface ProductSubscriptionWhereInput {
  mutation_in?: MutationType[] | MutationType;
  updatedFields_contains?: String;
  updatedFields_contains_every?: String[] | String;
  updatedFields_contains_some?: String[] | String;
  node?: ProductWhereInput;
  AND?: ProductSubscriptionWhereInput[] | ProductSubscriptionWhereInput;
  OR?: ProductSubscriptionWhereInput[] | ProductSubscriptionWhereInput;
  NOT?: ProductSubscriptionWhereInput[] | ProductSubscriptionWhereInput;
}

export interface UserUpdaterolesInput {
  set?: UserRole[] | UserRole;
}

export interface UserCreaterolesInput {
  set?: UserRole[] | UserRole;
}

export interface CategoryCreateInput {
  title: String;
  description?: String;
  subcategories?: CategoryCreateManyInput;
  products?: ProductCreateManyWithoutCategoriesInput;
}

export interface UserCreateInput {
  username: String;
  roles?: UserCreaterolesInput;
}

export interface CategoryCreateManyInput {
  create?: CategoryCreateInput[] | CategoryCreateInput;
  connect?: CategoryWhereUniqueInput[] | CategoryWhereUniqueInput;
}

export interface CategoryUpdateWithoutProductsDataInput {
  title?: String;
  description?: String;
  subcategories?: CategoryUpdateManyInput;
}

export interface ProductCreateManyWithoutCategoriesInput {
  create?:
    | ProductCreateWithoutCategoriesInput[]
    | ProductCreateWithoutCategoriesInput;
  connect?: ProductWhereUniqueInput[] | ProductWhereUniqueInput;
}

export interface CategoryUpdateWithWhereUniqueWithoutProductsInput {
  where: CategoryWhereUniqueInput;
  data: CategoryUpdateWithoutProductsDataInput;
}

export interface ProductCreateWithoutCategoriesInput {
  title: String;
  description?: String;
}

export interface UserWhereInput {
  id?: ID_Input;
  id_not?: ID_Input;
  id_in?: ID_Input[] | ID_Input;
  id_not_in?: ID_Input[] | ID_Input;
  id_lt?: ID_Input;
  id_lte?: ID_Input;
  id_gt?: ID_Input;
  id_gte?: ID_Input;
  id_contains?: ID_Input;
  id_not_contains?: ID_Input;
  id_starts_with?: ID_Input;
  id_not_starts_with?: ID_Input;
  id_ends_with?: ID_Input;
  id_not_ends_with?: ID_Input;
  username?: String;
  username_not?: String;
  username_in?: String[] | String;
  username_not_in?: String[] | String;
  username_lt?: String;
  username_lte?: String;
  username_gt?: String;
  username_gte?: String;
  username_contains?: String;
  username_not_contains?: String;
  username_starts_with?: String;
  username_not_starts_with?: String;
  username_ends_with?: String;
  username_not_ends_with?: String;
  AND?: UserWhereInput[] | UserWhereInput;
  OR?: UserWhereInput[] | UserWhereInput;
  NOT?: UserWhereInput[] | UserWhereInput;
}

export interface ProductCreateInput {
  title: String;
  description?: String;
  categories?: CategoryCreateManyWithoutProductsInput;
}

export interface UserSubscriptionWhereInput {
  mutation_in?: MutationType[] | MutationType;
  updatedFields_contains?: String;
  updatedFields_contains_every?: String[] | String;
  updatedFields_contains_some?: String[] | String;
  node?: UserWhereInput;
  AND?: UserSubscriptionWhereInput[] | UserSubscriptionWhereInput;
  OR?: UserSubscriptionWhereInput[] | UserSubscriptionWhereInput;
  NOT?: UserSubscriptionWhereInput[] | UserSubscriptionWhereInput;
}

export interface CategoryUpdateManyInput {
  create?: CategoryCreateInput[] | CategoryCreateInput;
  update?:
    | CategoryUpdateWithWhereUniqueNestedInput[]
    | CategoryUpdateWithWhereUniqueNestedInput;
  upsert?:
    | CategoryUpsertWithWhereUniqueNestedInput[]
    | CategoryUpsertWithWhereUniqueNestedInput;
  delete?: CategoryWhereUniqueInput[] | CategoryWhereUniqueInput;
  connect?: CategoryWhereUniqueInput[] | CategoryWhereUniqueInput;
  disconnect?: CategoryWhereUniqueInput[] | CategoryWhereUniqueInput;
}

export interface UserUpdateInput {
  username?: String;
  roles?: UserUpdaterolesInput;
}

export interface CategoryUpdateWithWhereUniqueNestedInput {
  where: CategoryWhereUniqueInput;
  data: CategoryUpdateDataInput;
}

export interface CategoryUpsertWithWhereUniqueWithoutProductsInput {
  where: CategoryWhereUniqueInput;
  update: CategoryUpdateWithoutProductsDataInput;
  create: CategoryCreateWithoutProductsInput;
}

export interface CategoryUpdateDataInput {
  title?: String;
  description?: String;
  subcategories?: CategoryUpdateManyInput;
  products?: ProductUpdateManyWithoutCategoriesInput;
}

export interface CategoryWhereInput {
  id?: ID_Input;
  id_not?: ID_Input;
  id_in?: ID_Input[] | ID_Input;
  id_not_in?: ID_Input[] | ID_Input;
  id_lt?: ID_Input;
  id_lte?: ID_Input;
  id_gt?: ID_Input;
  id_gte?: ID_Input;
  id_contains?: ID_Input;
  id_not_contains?: ID_Input;
  id_starts_with?: ID_Input;
  id_not_starts_with?: ID_Input;
  id_ends_with?: ID_Input;
  id_not_ends_with?: ID_Input;
  title?: String;
  title_not?: String;
  title_in?: String[] | String;
  title_not_in?: String[] | String;
  title_lt?: String;
  title_lte?: String;
  title_gt?: String;
  title_gte?: String;
  title_contains?: String;
  title_not_contains?: String;
  title_starts_with?: String;
  title_not_starts_with?: String;
  title_ends_with?: String;
  title_not_ends_with?: String;
  description?: String;
  description_not?: String;
  description_in?: String[] | String;
  description_not_in?: String[] | String;
  description_lt?: String;
  description_lte?: String;
  description_gt?: String;
  description_gte?: String;
  description_contains?: String;
  description_not_contains?: String;
  description_starts_with?: String;
  description_not_starts_with?: String;
  description_ends_with?: String;
  description_not_ends_with?: String;
  subcategories_every?: CategoryWhereInput;
  subcategories_some?: CategoryWhereInput;
  subcategories_none?: CategoryWhereInput;
  products_every?: ProductWhereInput;
  products_some?: ProductWhereInput;
  products_none?: ProductWhereInput;
  AND?: CategoryWhereInput[] | CategoryWhereInput;
  OR?: CategoryWhereInput[] | CategoryWhereInput;
  NOT?: CategoryWhereInput[] | CategoryWhereInput;
}

export interface ProductUpsertWithWhereUniqueWithoutCategoriesInput {
  where: ProductWhereUniqueInput;
  update: ProductUpdateWithoutCategoriesDataInput;
  create: ProductCreateWithoutCategoriesInput;
}

export interface ProductUpdateWithoutCategoriesDataInput {
  title?: String;
  description?: String;
}

export interface ProductUpdateWithWhereUniqueWithoutCategoriesInput {
  where: ProductWhereUniqueInput;
  data: ProductUpdateWithoutCategoriesDataInput;
}

export interface ProductWhereInput {
  id?: ID_Input;
  id_not?: ID_Input;
  id_in?: ID_Input[] | ID_Input;
  id_not_in?: ID_Input[] | ID_Input;
  id_lt?: ID_Input;
  id_lte?: ID_Input;
  id_gt?: ID_Input;
  id_gte?: ID_Input;
  id_contains?: ID_Input;
  id_not_contains?: ID_Input;
  id_starts_with?: ID_Input;
  id_not_starts_with?: ID_Input;
  id_ends_with?: ID_Input;
  id_not_ends_with?: ID_Input;
  title?: String;
  title_not?: String;
  title_in?: String[] | String;
  title_not_in?: String[] | String;
  title_lt?: String;
  title_lte?: String;
  title_gt?: String;
  title_gte?: String;
  title_contains?: String;
  title_not_contains?: String;
  title_starts_with?: String;
  title_not_starts_with?: String;
  title_ends_with?: String;
  title_not_ends_with?: String;
  description?: String;
  description_not?: String;
  description_in?: String[] | String;
  description_not_in?: String[] | String;
  description_lt?: String;
  description_lte?: String;
  description_gt?: String;
  description_gte?: String;
  description_contains?: String;
  description_not_contains?: String;
  description_starts_with?: String;
  description_not_starts_with?: String;
  description_ends_with?: String;
  description_not_ends_with?: String;
  categories_every?: CategoryWhereInput;
  categories_some?: CategoryWhereInput;
  categories_none?: CategoryWhereInput;
  AND?: ProductWhereInput[] | ProductWhereInput;
  OR?: ProductWhereInput[] | ProductWhereInput;
  NOT?: ProductWhereInput[] | ProductWhereInput;
}

export interface CategoryUpdateManyWithoutProductsInput {
  create?:
    | CategoryCreateWithoutProductsInput[]
    | CategoryCreateWithoutProductsInput;
  delete?: CategoryWhereUniqueInput[] | CategoryWhereUniqueInput;
  connect?: CategoryWhereUniqueInput[] | CategoryWhereUniqueInput;
  disconnect?: CategoryWhereUniqueInput[] | CategoryWhereUniqueInput;
  update?:
    | CategoryUpdateWithWhereUniqueWithoutProductsInput[]
    | CategoryUpdateWithWhereUniqueWithoutProductsInput;
  upsert?:
    | CategoryUpsertWithWhereUniqueWithoutProductsInput[]
    | CategoryUpsertWithWhereUniqueWithoutProductsInput;
}

export type UserWhereUniqueInput = AtLeastOne<{
  id: ID_Input;
}>;

export type ProductWhereUniqueInput = AtLeastOne<{
  id: ID_Input;
}>;

export interface CategorySubscriptionWhereInput {
  mutation_in?: MutationType[] | MutationType;
  updatedFields_contains?: String;
  updatedFields_contains_every?: String[] | String;
  updatedFields_contains_some?: String[] | String;
  node?: CategoryWhereInput;
  AND?: CategorySubscriptionWhereInput[] | CategorySubscriptionWhereInput;
  OR?: CategorySubscriptionWhereInput[] | CategorySubscriptionWhereInput;
  NOT?: CategorySubscriptionWhereInput[] | CategorySubscriptionWhereInput;
}

export interface NodeNode {
  id: ID_Output;
}

export interface UserPreviousValuesNode {
  id: ID_Output;
  username: String;
  roles: UserRole[];
}

export interface UserPreviousValues
  extends Promise<UserPreviousValuesNode>,
    Fragmentable {
  id: () => Promise<ID_Output>;
  username: () => Promise<String>;
  roles: () => Promise<UserRole[]>;
}

export interface UserPreviousValuesSubscription
  extends Promise<AsyncIterator<UserPreviousValuesNode>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  username: () => Promise<AsyncIterator<String>>;
  roles: () => Promise<AsyncIterator<UserRole[]>>;
}

export interface CategoryEdgeNode {
  cursor: String;
}

export interface CategoryEdge extends Promise<CategoryEdgeNode>, Fragmentable {
  node: <T = Category>() => T;
  cursor: () => Promise<String>;
}

export interface CategoryEdgeSubscription
  extends Promise<AsyncIterator<CategoryEdgeNode>>,
    Fragmentable {
  node: <T = CategorySubscription>() => T;
  cursor: () => Promise<AsyncIterator<String>>;
}

export interface BatchPayloadNode {
  count: Long;
}

export interface BatchPayload extends Promise<BatchPayloadNode>, Fragmentable {
  count: () => Promise<Long>;
}

export interface BatchPayloadSubscription
  extends Promise<AsyncIterator<BatchPayloadNode>>,
    Fragmentable {
  count: () => Promise<AsyncIterator<Long>>;
}

export interface ProductNode {
  id: ID_Output;
  title: String;
  description?: String;
}

export interface Product extends Promise<ProductNode>, Fragmentable {
  id: () => Promise<ID_Output>;
  title: () => Promise<String>;
  description: () => Promise<String>;
  categories: <T = FragmentableArray<CategoryNode>>(
    args?: {
      where?: CategoryWhereInput;
      orderBy?: CategoryOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => T;
}

export interface ProductSubscription
  extends Promise<AsyncIterator<ProductNode>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  title: () => Promise<AsyncIterator<String>>;
  description: () => Promise<AsyncIterator<String>>;
  categories: <T = Promise<AsyncIterator<CategorySubscription>>>(
    args?: {
      where?: CategoryWhereInput;
      orderBy?: CategoryOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => T;
}

export interface ProductPreviousValuesNode {
  id: ID_Output;
  title: String;
  description?: String;
}

export interface ProductPreviousValues
  extends Promise<ProductPreviousValuesNode>,
    Fragmentable {
  id: () => Promise<ID_Output>;
  title: () => Promise<String>;
  description: () => Promise<String>;
}

export interface ProductPreviousValuesSubscription
  extends Promise<AsyncIterator<ProductPreviousValuesNode>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  title: () => Promise<AsyncIterator<String>>;
  description: () => Promise<AsyncIterator<String>>;
}

export interface AggregateUserNode {
  count: Int;
}

export interface AggregateUser
  extends Promise<AggregateUserNode>,
    Fragmentable {
  count: () => Promise<Int>;
}

export interface AggregateUserSubscription
  extends Promise<AsyncIterator<AggregateUserNode>>,
    Fragmentable {
  count: () => Promise<AsyncIterator<Int>>;
}

export interface UserConnectionNode {}

export interface UserConnection
  extends Promise<UserConnectionNode>,
    Fragmentable {
  pageInfo: <T = PageInfo>() => T;
  edges: <T = FragmentableArray<UserEdgeNode>>() => T;
  aggregate: <T = AggregateUser>() => T;
}

export interface UserConnectionSubscription
  extends Promise<AsyncIterator<UserConnectionNode>>,
    Fragmentable {
  pageInfo: <T = PageInfoSubscription>() => T;
  edges: <T = Promise<AsyncIterator<UserEdgeSubscription>>>() => T;
  aggregate: <T = AggregateUserSubscription>() => T;
}

export interface PageInfoNode {
  hasNextPage: Boolean;
  hasPreviousPage: Boolean;
  startCursor?: String;
  endCursor?: String;
}

export interface PageInfo extends Promise<PageInfoNode>, Fragmentable {
  hasNextPage: () => Promise<Boolean>;
  hasPreviousPage: () => Promise<Boolean>;
  startCursor: () => Promise<String>;
  endCursor: () => Promise<String>;
}

export interface PageInfoSubscription
  extends Promise<AsyncIterator<PageInfoNode>>,
    Fragmentable {
  hasNextPage: () => Promise<AsyncIterator<Boolean>>;
  hasPreviousPage: () => Promise<AsyncIterator<Boolean>>;
  startCursor: () => Promise<AsyncIterator<String>>;
  endCursor: () => Promise<AsyncIterator<String>>;
}

export interface UserNode {
  id: ID_Output;
  username: String;
  roles: UserRole[];
}

export interface User extends Promise<UserNode>, Fragmentable {
  id: () => Promise<ID_Output>;
  username: () => Promise<String>;
  roles: () => Promise<UserRole[]>;
}

export interface UserSubscription
  extends Promise<AsyncIterator<UserNode>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  username: () => Promise<AsyncIterator<String>>;
  roles: () => Promise<AsyncIterator<UserRole[]>>;
}

export interface CategoryNode {
  id: ID_Output;
  title: String;
  description?: String;
}

export interface Category extends Promise<CategoryNode>, Fragmentable {
  id: () => Promise<ID_Output>;
  title: () => Promise<String>;
  description: () => Promise<String>;
  subcategories: <T = FragmentableArray<CategoryNode>>(
    args?: {
      where?: CategoryWhereInput;
      orderBy?: CategoryOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => T;
  products: <T = FragmentableArray<ProductNode>>(
    args?: {
      where?: ProductWhereInput;
      orderBy?: ProductOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => T;
}

export interface CategorySubscription
  extends Promise<AsyncIterator<CategoryNode>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  title: () => Promise<AsyncIterator<String>>;
  description: () => Promise<AsyncIterator<String>>;
  subcategories: <T = Promise<AsyncIterator<CategorySubscription>>>(
    args?: {
      where?: CategoryWhereInput;
      orderBy?: CategoryOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => T;
  products: <T = Promise<AsyncIterator<ProductSubscription>>>(
    args?: {
      where?: ProductWhereInput;
      orderBy?: ProductOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => T;
}

export interface ProductEdgeNode {
  cursor: String;
}

export interface ProductEdge extends Promise<ProductEdgeNode>, Fragmentable {
  node: <T = Product>() => T;
  cursor: () => Promise<String>;
}

export interface ProductEdgeSubscription
  extends Promise<AsyncIterator<ProductEdgeNode>>,
    Fragmentable {
  node: <T = ProductSubscription>() => T;
  cursor: () => Promise<AsyncIterator<String>>;
}

export interface ProductSubscriptionPayloadNode {
  mutation: MutationType;
  updatedFields?: String[];
}

export interface ProductSubscriptionPayload
  extends Promise<ProductSubscriptionPayloadNode>,
    Fragmentable {
  mutation: () => Promise<MutationType>;
  node: <T = Product>() => T;
  updatedFields: () => Promise<String[]>;
  previousValues: <T = ProductPreviousValues>() => T;
}

export interface ProductSubscriptionPayloadSubscription
  extends Promise<AsyncIterator<ProductSubscriptionPayloadNode>>,
    Fragmentable {
  mutation: () => Promise<AsyncIterator<MutationType>>;
  node: <T = ProductSubscription>() => T;
  updatedFields: () => Promise<AsyncIterator<String[]>>;
  previousValues: <T = ProductPreviousValuesSubscription>() => T;
}

export interface CategoryConnectionNode {}

export interface CategoryConnection
  extends Promise<CategoryConnectionNode>,
    Fragmentable {
  pageInfo: <T = PageInfo>() => T;
  edges: <T = FragmentableArray<CategoryEdgeNode>>() => T;
  aggregate: <T = AggregateCategory>() => T;
}

export interface CategoryConnectionSubscription
  extends Promise<AsyncIterator<CategoryConnectionNode>>,
    Fragmentable {
  pageInfo: <T = PageInfoSubscription>() => T;
  edges: <T = Promise<AsyncIterator<CategoryEdgeSubscription>>>() => T;
  aggregate: <T = AggregateCategorySubscription>() => T;
}

export interface CategoryPreviousValuesNode {
  id: ID_Output;
  title: String;
  description?: String;
}

export interface CategoryPreviousValues
  extends Promise<CategoryPreviousValuesNode>,
    Fragmentable {
  id: () => Promise<ID_Output>;
  title: () => Promise<String>;
  description: () => Promise<String>;
}

export interface CategoryPreviousValuesSubscription
  extends Promise<AsyncIterator<CategoryPreviousValuesNode>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  title: () => Promise<AsyncIterator<String>>;
  description: () => Promise<AsyncIterator<String>>;
}

export interface CategorySubscriptionPayloadNode {
  mutation: MutationType;
  updatedFields?: String[];
}

export interface CategorySubscriptionPayload
  extends Promise<CategorySubscriptionPayloadNode>,
    Fragmentable {
  mutation: () => Promise<MutationType>;
  node: <T = Category>() => T;
  updatedFields: () => Promise<String[]>;
  previousValues: <T = CategoryPreviousValues>() => T;
}

export interface CategorySubscriptionPayloadSubscription
  extends Promise<AsyncIterator<CategorySubscriptionPayloadNode>>,
    Fragmentable {
  mutation: () => Promise<AsyncIterator<MutationType>>;
  node: <T = CategorySubscription>() => T;
  updatedFields: () => Promise<AsyncIterator<String[]>>;
  previousValues: <T = CategoryPreviousValuesSubscription>() => T;
}

export interface ProductConnectionNode {}

export interface ProductConnection
  extends Promise<ProductConnectionNode>,
    Fragmentable {
  pageInfo: <T = PageInfo>() => T;
  edges: <T = FragmentableArray<ProductEdgeNode>>() => T;
  aggregate: <T = AggregateProduct>() => T;
}

export interface ProductConnectionSubscription
  extends Promise<AsyncIterator<ProductConnectionNode>>,
    Fragmentable {
  pageInfo: <T = PageInfoSubscription>() => T;
  edges: <T = Promise<AsyncIterator<ProductEdgeSubscription>>>() => T;
  aggregate: <T = AggregateProductSubscription>() => T;
}

export interface AggregateProductNode {
  count: Int;
}

export interface AggregateProduct
  extends Promise<AggregateProductNode>,
    Fragmentable {
  count: () => Promise<Int>;
}

export interface AggregateProductSubscription
  extends Promise<AsyncIterator<AggregateProductNode>>,
    Fragmentable {
  count: () => Promise<AsyncIterator<Int>>;
}

export interface UserSubscriptionPayloadNode {
  mutation: MutationType;
  updatedFields?: String[];
}

export interface UserSubscriptionPayload
  extends Promise<UserSubscriptionPayloadNode>,
    Fragmentable {
  mutation: () => Promise<MutationType>;
  node: <T = User>() => T;
  updatedFields: () => Promise<String[]>;
  previousValues: <T = UserPreviousValues>() => T;
}

export interface UserSubscriptionPayloadSubscription
  extends Promise<AsyncIterator<UserSubscriptionPayloadNode>>,
    Fragmentable {
  mutation: () => Promise<AsyncIterator<MutationType>>;
  node: <T = UserSubscription>() => T;
  updatedFields: () => Promise<AsyncIterator<String[]>>;
  previousValues: <T = UserPreviousValuesSubscription>() => T;
}

export interface UserEdgeNode {
  cursor: String;
}

export interface UserEdge extends Promise<UserEdgeNode>, Fragmentable {
  node: <T = User>() => T;
  cursor: () => Promise<String>;
}

export interface UserEdgeSubscription
  extends Promise<AsyncIterator<UserEdgeNode>>,
    Fragmentable {
  node: <T = UserSubscription>() => T;
  cursor: () => Promise<AsyncIterator<String>>;
}

export interface AggregateCategoryNode {
  count: Int;
}

export interface AggregateCategory
  extends Promise<AggregateCategoryNode>,
    Fragmentable {
  count: () => Promise<Int>;
}

export interface AggregateCategorySubscription
  extends Promise<AsyncIterator<AggregateCategoryNode>>,
    Fragmentable {
  count: () => Promise<AsyncIterator<Int>>;
}

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean;

/*
The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. 
*/
export type Int = number;

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number;
export type ID_Output = string;

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string;

export type Long = string;

/**
 * Type Defs
 */

export const prisma: Prisma;
