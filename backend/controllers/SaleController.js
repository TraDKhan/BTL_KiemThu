import PromoCode from "../models/SaleModel.js";

const addPromoCode = async (req, res) => {
  const { code, discount, expirationDate, isActive } = req.body;

  try {
    const existingCode = await PromoCode.findOne({ code });
    if (existingCode) {
      return res.status(400).json({ success: false, message: "Promo code already exists" });
    }

    const newPromoCode = new PromoCode({
      code,
      discount,
      expirationDate: expirationDate ? new Date(expirationDate) : null,
      isActive,
    });

    await newPromoCode.save();
    res.json({ success: true, message: "Promo code added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error adding promo code" });
  }
};
const listPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find();
    res.json({ success: true, data: promoCodes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching promo codes" });
  }
};


const deletePromoCode = async (req, res) => {
  const { id } = req.params;
  try {
    const promoCode = await PromoCode.findById(id);
    if (!promoCode) {
      return res.status(404).json({ success: false, message: "Promo code not found" });
    }
    await PromoCode.findByIdAndDelete(id);
    res.json({ success: true, message: "Promo code deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting promo code" });
  }
};
const validatePromoCode = async (req, res) => {
  const { code } = req.body;

  try {
    // Find the promo code in the database
    const promo = await PromoCode.findOne({ code });

    if (!promo) {
      return res.status(404).json({ success: false, message: "Mã đã hết lượt sử dụng" });
    }

    // Check if the promo code is expired or inactive
    if (!promo.isActive || new Date(promo.expirationDate) < new Date()) {
      return res.status(400).json({ success: false, message: "Mã khuyến mãi đã hết hạn" });
    }

    // Return the valid promo code details (such as discount)
    return res.json({ success: true, discount: promo.discount, message: "Lưu thành công" });
  } catch (error) {
    console.error("Error in validatePromoCode:", error);  // More detailed logging
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export { validatePromoCode, addPromoCode, listPromoCodes, deletePromoCode };
