import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import {
  TypeBoxTypeProvider,
  TypeBoxValidatorCompiler,
} from "@fastify/type-provider-typebox";

import routes from "./routes";

const f = fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

f.setValidatorCompiler(TypeBoxValidatorCompiler);

f.register(fastifySwagger, {
  openapi: {
    openapi: "3.1.0",
    info: {
      title: "Tickr API",
      description: "Tickr API",
      version: "0.0.0",
    },
    components: {
      securitySchemes: {
        apiKey: {
          type: "apiKey",
          name: "apiKey",
          in: "header",
        },
      },
    },
  },
});

f.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  staticCSP: true,
});

f.register(routes);

const start = async () => {
  try {
    await f.ready();
    const address = await f.listen({ port: 3000 });
    f.log.info(`Server listening on ${address}`);
  } catch (err) {
    f.log.error(err);
    process.exit(1);
  }
};

void start();
