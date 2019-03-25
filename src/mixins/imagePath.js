export const imagePath = {
  methods: {
    imagePath(product) {
      return require(`../assets/img/products/${product.images[0]}`);
    }
  }
};
