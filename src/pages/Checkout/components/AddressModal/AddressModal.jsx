import "./AddressModal.css";
import React, { useState } from "react";
import { addAddressService } from "../../../../services/address-services/addAddressService";
import { useUserData } from "../../../../contexts/UserDataProvider.js";
import { updateAddressService } from "../../../../services/address-services/updateAddressService";
import { toast } from "react-hot-toast";
import { useAddress } from "../../../../contexts/AddressProvider.js";
import { useAuth } from "../../../../contexts/AuthProvider.js";

export const AddressModal = () => {
  const [, setLoading] = useState(false);
  const [, setError] = useState(false);
  const { auth } = useAuth();
  const { dispatch } = useUserData();

  const {
    setIsAddressModalOpen,
    addressForm,
    setAddressForm,
    isEdit,
    setIsEdit,
  } = useAddress();

  // Validation Function
  const validateForm = () => {
    const nameRegex = /^[a-zA-Z\s]{3,}$/;
    const streetRegex = /^.{5,}$/;
    const cityStateCountryRegex = /^[a-zA-Z\s]{3,}$/;
    const pincodeRegex = /^\d{6}$/;
    const phoneRegex = /^[0-9\-]{10,}$/;

    if (!nameRegex.test(addressForm.name)) {
      toast.error("Name must be at least 3 characters and contain only letters.");
      return false;
    }
    if (!streetRegex.test(addressForm.street)) {
      toast.error("Street must be at least 5 characters long.");
      return false;
    }
    if (!cityStateCountryRegex.test(addressForm.city)) {
      toast.error("City must contain only letters and be at least 3 characters.");
      return false;
    }
    if (!cityStateCountryRegex.test(addressForm.state)) {
      toast.error("State must contain only letters and be at least 3 characters.");
      return false;
    }
    if (!cityStateCountryRegex.test(addressForm.country)) {
      toast.error("Country must contain only letters and be at least 3 characters.");
      return false;
    }
    if (!pincodeRegex.test(addressForm.pincode)) {
      toast.error("Pincode must be exactly 6 digits.");
      return false;
    }
    if (!phoneRegex.test(addressForm.phone)) {
      toast.error("Phone number must be 10 digits.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");

      if (isEdit) {
        const response = await updateAddressService(addressForm, auth.token);
        if (response.status === 200) {
          toast.success(`Address updated successfully!`);
          dispatch({ type: "SET_ADDRESS", payload: response.data.addressList });
        }
      } else {
        const response = await addAddressService(addressForm, auth.token);
        if (response.status === 201) {
          toast.success("New address added successfully!");
          dispatch({ type: "SET_ADDRESS", payload: response.data.addressList });
        }
      }

      setIsAddressModalOpen(false);
      setIsEdit(false);
      setAddressForm({
        name: "",
        street: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        phone: "",
      });

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="address-modal-container">
      <div className="address-input-container">
        <h1>Address Form</h1>
        <form onSubmit={handleSubmit} className="input-container">
          <input
            name="name"
            value={addressForm.name}
            required
            onChange={(e) =>
              setAddressForm({ ...addressForm, name: e.target.value })
            }
            placeholder="Enter Name"
          />
          <input
            name="street"
            value={addressForm.street}
            required
            onChange={(e) =>
              setAddressForm({ ...addressForm, street: e.target.value })
            }
            placeholder="Enter Street"
          />
          <input
            name="city"
            value={addressForm.city}
            required
            onChange={(e) =>
              setAddressForm({ ...addressForm, city: e.target.value })
            }
            placeholder="Enter City"
          />
          <input
            name="state"
            value={addressForm.state}
            required
            onChange={(e) =>
              setAddressForm({ ...addressForm, state: e.target.value })
            }
            placeholder="Enter State"
          />
          <input
            name="country"
            value={addressForm.country}
            required
            onChange={(e) =>
              setAddressForm({ ...addressForm, country: e.target.value })
            }
            placeholder="Enter Country"
          />
          <input
            name="pincode"
            value={addressForm.pincode}
            required
            onChange={(e) =>
              setAddressForm({ ...addressForm, pincode: e.target.value })
            }
            placeholder="Enter Pincode"
          />
          <input
            name="phone"
            value={addressForm.phone}
            required
            onChange={(e) =>
              setAddressForm({ ...addressForm, phone: e.target.value })
            }
            placeholder="Enter Phone"
          />
          <input className="submit" type="submit" value="Save" />
        </form>
        <div className="btn-container">
          <button onClick={() => setIsAddressModalOpen(false)}>Cancel</button>
          <button
            onClick={() => {
              setAddressForm({
                name: "Aniket Saini",
                street: "66/6B Main Post Office",
                city: "Roorkee",
                state: "Uttarakhand",
                country: "India",
                pincode: "247667",
                phone: "9639060737",
              });
            }}
          >
            Add Dummy Data
          </button>
        </div>
      </div>
    </div>
  );
};
