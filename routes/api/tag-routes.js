const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  router.get('/', async (req, res) => {
    try {
      const tagData = await Tag.findall ({
        include: [Tag]
      })
      res.json (tagData)
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  });
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const dbTagData = await Tag.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'tag_name'
      ],
      include: [
        {
          model: Product,
          through: ProductTag,
          as: 'tagged_product'
        }
      ]
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


router.post('/', async (req, res) => {
  // create a new tag
    Tag.create({
      tag_name: req.body.tag_name
    }) 
  });

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const updatedTag = await Tag.update(
      {
        tag_name: req.body.tag_name
      },
      {
        where: {
          id: req.params.id
        }
      }
    );
    if (updatedTag[0] === 0) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }
    console.log(err);
    res.status(500).json({ error: 'Failed to update tag' });
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const deletedTag = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!deletedTag) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }

    res.status(200).json({ message: 'Tag deleted successfully' });
});


module.exports = router;
