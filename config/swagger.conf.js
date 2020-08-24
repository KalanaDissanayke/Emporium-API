const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Emporium API',
            version: '1.0.0',
            description: 'Best marketplace for introverts 🤓',
            // license: {
            //     name: 'MIT',
            //     url: '',
            // },
        },
        servers: [
            {
                url: 'http://localhost:{port}/{basePath}',
                description: 'Development Server',
                variables: {
                    port: {
                        enum: ['5000'],
                        default: '5000',
                    },
                    basePath: {
                        default: 'api/v1',
                    },
                },
            },
        ],
    },
    apis: ['./routes/*.js', './models/*.js'],
};

module.exports = options;
