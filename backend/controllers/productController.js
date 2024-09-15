const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/Product");

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save images to 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the original filename
  },
});

// File filter to only accept image types
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."),
      false
    );
  }
};

// Initialize multer with storage options and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Create a new product
exports.createProduct = [
  upload.single("image"), // Handle single image upload
  async (req, res) => {
    try {
      const { name, description, price, quantity, category } = req.body;
      let imageUrl = "";

      // Check if an image was uploaded
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`; // Store the path to the image
      }

      // Create the product object
      const product = new Product({
        name,
        description,
        price,
        quantity,
        category,
        image: imageUrl,
      });

      // Save the product to the database
      const savedProduct = await product.save();
      res
        .status(201)
        .json({ message: "Product added successfully", product: savedProduct });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Error creating product" });
    }
  },
];

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error fetching product" });
  }
};

exports.updateProduct = [
  upload.single("image"), // Handle image upload for updating
  async (req, res) => {
    try {
      const productId = req.params.id;
      let updatedData = req.body;

      // Find the product first to check for existing image
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // If a new image is uploaded, overwrite the existing image
      if (req.file) {
        // Use the same image file name to replace the old one
        const existingImagePath = path.join(__dirname, "../", product.image);

        // Check if the existing image file exists
        if (fs.existsSync(existingImagePath)) {
          // Overwrite the existing image file with the new one
          fs.writeFileSync(existingImagePath, fs.readFileSync(req.file.path));

          // Remove the uploaded file (since we're reusing the existing file name)
          fs.unlinkSync(req.file.path);
        } else {
          // If no existing file, just update the image with the new one
          updatedData.image = `/uploads/${req.file.filename}`;
        }
      }

      // Update the product with the new data (excluding image if it's not updated)
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updatedData,
        { new: true }
      );

      res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Error updating product" });
    }
  },
];

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete the image from the uploads folder if it exists
    if (product.image) {
      const imagePath = path.join(__dirname, "../", product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Remove the image file
      }
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Error deleting product" });
  }
};
