const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData =  await Category.findAll({
      include: [Product]
    })
  
    res.json(categoryData)
    
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const dbCategoryData = await Category.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'category_name'
      ],
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
        }
      ]
    });
    if (!dbCategoryData) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.json(dbCategoryData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to retrieve category data' });
  }
});

router.post('/', (req, res) => {
  // create a new category
  Category.create({
    category_name: req.body.category_name
  })
  .then(dbCategoryData => res.json(dbCategoryData))
  .catch(err => {
    console.log(err);
    res.status(400).json(err);
  })
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
    try {
      const updatedCategory = await Category.update(
        { category_name: req.body.category_name },
        { where: { id: req.params.id } }
      );
      if (updatedCategory[0] === 0) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      // Fetch the updated category data after the update
      const updatedData = await Category.findByPk(req.params.id);
  
      res.json(updatedData);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Failed to update category' });
    }
  });

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
    try {
      const deletedCategory = await Category.destroy({
        where: { id: req.params.id }
      });
      if (!deletedCategory) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Failed to delete category' });
    }
});

module.exports = router;
