<template>
  <div class="wrapper">
    <h1>Cart</h1>
    <div class="flex-col">
      <div>
        <ul>
          <li v-for="item in uniqueCartItems" class="flex-col cart-list__item">
            <router-link :to="{ name: 'product', params: { id: item.id } }">
              <img
                :src="imagePath(item)"
                class="thumbnail"
                alt="product thumnail"
              />
            </router-link>
            <div class="flex-col cart-list__item__details">
              <div>
                <p>
                  <router-link
                    :to="{ name: 'product', params: { id: item.id } }"
                    >{{ item.name }}
                  </router-link>
                </p>
                <p>Price: ${{ item.price }}</p>
                <p>Size: {{ item.size }}</p>
                <p>Color: {{ item.color }}</p>
                <p>Subtotal: ${{ item.price * itemQuantities[item.name] }}</p>
              </div>
              <div class="cart-list__quantity">
                <p>Quantity: {{ itemQuantities[item.name] }}</p>
                <button
                  type="button"
                  @click="removeFromCart(item.id)"
                  class="btn cart-list__btn-remove"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        </ul>
        <p class="cart__btn-continue-shopping">
          <router-link to="/">Continue Shopping</router-link>
        </p>
      </div>
      <section class="total-section" v-if="cartItemsCount > 0">
        <ul class="total-section-list">
          <li class="total-section__item">
            <p class="total-section__item__label">{{ cartItemsCount }} items</p>
            <p>{{ itemsSubtotal }}</p>
          </li>
          <li class="total-section__item">
            <p class="total-section__item__label">Shipping</p>
            <select v-model="selectedShippingOption">
              <option disabled value="">Please select an option</option>
              <option
                v-for="option in shippingOptionsArray"
                :key="option.text"
                :value="option.rate"
              >
                {{ option.text }} (${{ option.rate }})
              </option>
            </select>
          </li>
          <li class="total-section__item">
            <p class="total-section__item__label">Subtotal</p>
            <p>{{ subtotal }}</p>
          </li>
          <li class="total-section__item">
            <p class="total-section__item__label">Tax(6%)</p>
            <p>{{ salesTaxApplied }}</p>
          </li>
          <li class="total-section__item">
            <p class="total-section__item__label">Total</p>
            <p>{{ total }}</p>
          </li>
        </ul>

        <button
          :disabled="!this.selectedShippingOption"
          class="btn btn--grey total-section__checkout-button"
        >
          Check out
        </button>
      </section>
      <section v-else><p>Your cart is empty.</p></section>
    </div>
  </div>
</template>

<script>
import { imagePath } from "@/mixins/imagePath.js";

export default {
  name: "cart",
  mixins: [imagePath],
  data() {
    return {
      salesTax: 0.06,
      selectedShippingOption: "",
      shippingOptionsArray: [
        {
          text: "One day",
          rate: 20
        },
        {
          text: "Two days",
          rate: 15
        },
        {
          text: "Three to five days",
          rate: 10
        },
        {
          text: "One week or more",
          rate: 5
        }
      ]
    };
  },
  computed: {
    cartItems() {
      return this.$store.getters.cartItems;
    },
    uniqueCartItems() {
      let itemsByName = this.cartItems.reduce((itemsByName, cartItem) => {
        if (!itemsByName.hasOwnProperty(cartItem.name)) {
          itemsByName[cartItem.name] = cartItem;
        }
        return itemsByName;
      }, {});

      return Object.values(itemsByName);
    },
    cartItemsCount() {
      return this.cartItems.length;
    },
    itemsSubtotal() {
      return this.cartItems.reduce((total, item) => total + item.price, 0);
    },
    subtotal() {
      return Number(this.itemsSubtotal);
    },
    salesTaxPercentage() {
      return `${this.salesTax * 100}%`;
    },
    salesTaxApplied() {
      return (this.subtotal * this.salesTax).toFixed(2);
    },
    itemQuantities() {
      let quantities = this.cartItems.reduce((itemQuantities, cartItem) => {
        itemQuantities[cartItem.name] =
          (itemQuantities[cartItem.name] || 0) + 1;
        return itemQuantities;
      }, {});
      return quantities;
    },
    total() {
      if (this.cartItemsCount <= 0) {
        return "---";
      }

      if (this.selectedShippingOption) {
        return (
          Number(this.subtotal) +
          Number(this.salesTaxApplied) +
          +Number(this.selectedShippingOption)
        );
      }
      return "Please select a shipping option";
    }
  },
  methods: {
    removeFromCart(itemId) {
      this.$store.dispatch("removeFromCart", itemId);
    }
  }
};
</script>

<style>
.cart__btn-continue-shopping {
  text-align: right;
}

.cart-list {
  width: 70%;
  margin-right: 1rem;
  @media only screen and (max-width: 832px) {
    width: 100%;
  }
}

.cart-list__item {
  width: 100%;
  border-bottom: 1px solid #2c3e50;
}

.cart-list__item__details {
  flex: 2;
  justify-content: space-between;
  margin-left: 2rem;
}

.cart-list__quantity {
  padding-left: 2em;
}

.thumbnail {
  max-width: 50px;
  margin-top: 0.5rem;
}

.cart-list__btn-remove {
  margin-top: 0.5rem;
  font-weight: normal;
  &:hover {
    color: red;
  }
}

.total-section {
  background: #fafafa;
  padding: 0 1rem 1rem;
  min-width: 33%;
  margin-left: 1em;
}

.total-section-list {
  margin: 0;
  padding: 0;
}

.total-section__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-section__item__label {
  font-weight: bold;
  margin-right: 1rem;
}

.total-section__checkout-button {
  width: 100%;
}

.total-section__checkout-button:disabled {
  opacity: 0.2;
}
</style>
