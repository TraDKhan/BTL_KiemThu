import { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from 'sweetalert2'

const List = ({ url }) => {
    const [list, setList] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [updatedData, setUpdatedData] = useState({
        name: "",
        category: "",
        price: "",
        description: "",
        image: null,
    });

    // Fetch the list of products
    const fetchList = async () => {
        const response = await axios.get(`${url}/api/food/list`);

        if (response.data.success) {
            setList(response.data.data);
        } else {
            toast.error("Error fetching products");
        }
    };

    // Remove food item
    const removeFood = async (foodId) => {
        Swal.fire({
            title: "Bạn có chắc muốn xóa?",
            text: "Sản phẩm sẽ bị xóa vĩnh viễn!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await axios.post(`${url}/api/food/remove`, {
                    id: foodId,
                });
                await fetchList();

                if (response.data.success) {
                    toast.success(response.data.message);
                } else {
                    toast.error("Error removing product");
                }
            }
        })

    };

    // Start editing a product
    const startEditing = (food) => {
        setIsEditing(true);
        setEditProduct(food);
        setUpdatedData({
            name: food.name,
            category: food.category,
            price: food.price,
            description: food.description,
            image: null,
        });
    };

    // Handle form data change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData({ ...updatedData, [name]: value });
    };

    // Handle image file change
    const handleImageChange = (e) => {
        setUpdatedData({ ...updatedData, image: e.target.files[0] });
    };

    const saveEdit = async (foodId) => {
        const formData = new FormData();
        formData.append("id", foodId);
        formData.append("name", updatedData.name);
        formData.append("category", updatedData.category);
        formData.append("price", updatedData.price);
        formData.append("description", updatedData.description);
        if (updatedData.image) {
            formData.append("image", updatedData.image);
        }

        const response = await axios.put(`${url}/api/food/update`, formData);
        if (response.data.success) {
            toast.success("Product updated successfully");
            fetchList();
            setIsEditing(false);
            setEditProduct(null);
        } else {
            toast.error("Error updating product");
        }
    };

    // Cancel editing
    const cancelEdit = () => {
        setIsEditing(false);
        setEditProduct(null);
        setUpdatedData({
            name: "",
            category: "",
            price: "",
            description: "",
            image: null,
        });
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className="list add flex-col">
            <div className="list-wrapper">
                <p className="page-title">Product List</p>

                {/* FORM EDIT */}
                {isEditing && editProduct && (
                    <div className="edit-form">
                        <h3 className="edit-form-title">Edit Product</h3>

                        <div className="edit-form-row">
                            <label>Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={updatedData.name}
                                onChange={handleChange}
                                placeholder="Product Name"
                            />
                        </div>

                        <div className="edit-form-row">
                            <label>Category</label>
                            <input
                                type="text"
                                name="category"
                                value={updatedData.category}
                                onChange={handleChange}
                                placeholder="Category"
                            />
                        </div>

                        <div className="edit-form-row">
                            <label>Price</label>
                            <input
                                type="number"
                                name="price"
                                value={updatedData.price}
                                onChange={handleChange}
                                placeholder="Price"
                            />
                        </div>

                        <div className="edit-form-row">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={updatedData.description}
                                onChange={handleChange}
                                placeholder="Description"
                                rows={3}
                            />
                        </div>

                        <div className="edit-form-row">
                            <label>Image</label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                        </div>

                        <div className="edit-form-actions">
                            <button
                                className="btn-save"
                                onClick={() => saveEdit(editProduct._id)}
                            >
                                Save
                            </button>
                            <button className="btn-cancel" onClick={cancelEdit}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* LIST SẢN PHẨM */}
                {!isEditing && (
                    <div className="list-table">
                        <div className="list-table-format title">
                            <b>Image</b>
                            <b>Name</b>
                            <b>Category</b>
                            <b>Price</b>
                            <b>Action</b>
                        </div>

                        {list.map((item, index) => (
                            <div key={index} className="list-table-format">
                                <img src={`${url}/images/` + item.image} alt={item.name} />
                                <p>{item.name}</p>
                                <p>{item.category}</p>
                                <p>${item.price}</p>
                                <p>
                                    <button onClick={() => startEditing(item)}>Edit</button>
                                    <button onClick={() => removeFood(item._id)}>Delete</button>
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default List;
