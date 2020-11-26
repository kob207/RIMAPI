const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userImage: { type: String    },
    phoneno: { type: String, required: true }, 
    name: { type: String, required: true },
    addno: { type: String  },
    gender:{ type: String  },
    birth_date:{ type: String  },
    status: { type: Array, required: true } 
});
module.exports = mongoose.model('users', userSchema);


/* const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    productImage: { type: String, required: true }
});
module.exports = mongoose.model('Product', productSchema); */