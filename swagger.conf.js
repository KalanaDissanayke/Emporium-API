const options = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "Emporium API",
        version: "1.0.0",
        description:
          "Best marketplace for introverts",
        license: {
          name: "MIT",
          url: ""
        },
        // contact: {
        //   name: "Swagger",
        //   url: "https://swagger.io",
        //   email: "Info@SmartBear.com"
        // }
      },
      servers: [
        {
          url: "http://localhost:5000"
        }
      ]
    },
    apis: ["./routes/products.js"]
  };

  module.exports = options;