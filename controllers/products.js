// @desc            Get all products
// @route           GET /api/v1/products
// @access          Public
exports.getProducts = (req, res, next) => {
    res.status(200).json({ success: true, msg: 'Show all products' });
};

// @desc            Get single products
// @route           GET /api/v1/products/:id
// @access          Public
exports.getProduct = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Show product ${req.params.id}` });
};

// @desc            Create new product
// @route           POST /api/v1/products
// @access          Private
exports.createProduct = async (req, res, next) => {
    res.status(201).json({ success: true, msg: 'Create new product' });
};

// @desc            Update product
// @route           PUT /api/v1/products/:id
// @access          Private
exports.updateProduct = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Update product ${req.params.id}` });
};

// @desc            Delete product
// @route           DELETE /api/v1/products/:id
// @access          Private
exports.deleteProduct = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Delete product ${req.params.id}` });
};
