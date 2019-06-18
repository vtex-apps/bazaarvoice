import { Service } from "@vtex/api";

import Query from "./graphql/Queries/Resolvers";

export default new Service({
	graphql: {
		resolvers: {
			Query
		}
	}
});
