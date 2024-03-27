const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// GET all tags
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product, through: ProductTag, as: 'tagged_product' }]
    });
    res.json(tagData);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// GET a single tag by id
router.get('/:id', async (req, res) => {
  try {
    const dbTagData = await Tag.findOne({
      where: { id: req.params.id },
      include: [{ model: Product, through: ProductTag, as: 'tagged_product' }]
    });
    if (!dbTagData) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }
    res.json(dbTagData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to retrieve tag data' });
  }
});

// POST create a new tag
router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create({
      tag_name: req.body.tag_name
    });
    res.status(200).json(newTag);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to create a new tag' });
  }
});

// PUT update a tag by id
router.put('/:id', async (req, res) => {
  try {
    const updatedTag = await Tag.update(
      { tag_name: req.body.tag_name },
      { where: { id: req.params.id } }
    );
    if (updatedTag[0] === 0) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }
    res.status(200).json({ message: 'Tag updated successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to update tag' });
  }
});

// DELETE a tag by id
router.delete('/:id', async (req, res) => {
  try {
    const deletedTag = await Tag.destroy({
      where: { id: req.params.id }
    });
    if (!deletedTag) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }
    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to delete tag' });
  }
});

module.exports = router;
