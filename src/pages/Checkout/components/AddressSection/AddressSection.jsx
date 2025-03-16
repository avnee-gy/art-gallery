import "./AddressSection.css";
import React from "react";
import { useAddress } from "../../../../contexts/AddressProvider.js";
import { useUserData } from "../../../../contexts/UserDataProvider.js";
import { AddressModal } from "../AddressModal/AddressModal";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../../contexts/AuthProvider.js";
import { FaTrash } from "react-icons/fa"; // Importing delete icon
import { removeAddressService } from "../../../../services/address-services/removeAddressService.js";
import { MdDelete } from "react-icons/md";

export const AddressSection = () => {
  const { userDataState, dispatch } = useUserData();
  const { isAddressModalOpen, setIsAddressModalOpen } = useAddress();
  const { auth } = useAuth();

  const deleteAddress = async (address) => {
    try {
      const response = await removeAddressService(address, auth.token);
      if (response.status === 200) {
        toast.success(`${address.name}'s address successfully deleted!`);
        dispatch({ type: "SET_ADDRESS", payload: response.data.addressList });
      }
    } catch (error) {
      toast.error("Failed to delete the address.");
      console.error(error);
    }
  };

  return (
    <div className="address-container">
      {userDataState.addressList?.map((address) => {
        const { name, street, city, state, country, pincode, phone, _id } =
          address;

        return (
          <div key={_id} className="address-card">
            <div className="address-details">
            <input
              checked={_id === userDataState.orderDetails?.orderAddress?._id}
              onChange={() => {
                dispatch({
                  type: "SET_ORDER",
                  payload: { orderAddress: address },
                });
              }}
              name="address"
              id={_id}
              type="radio"
            />
            <label htmlFor={_id}>
              <p className="name">{name}</p>
              <p className="address">
                {street}, {city}, {state}, {country} {pincode} - {phone}
              </p>
            </label>
            </div>

            {/* Delete Icon */}
            
            <button
              className="delete-address-btn"
              onClick={() => deleteAddress(address)}
            >
              <MdDelete size={25} />
            </button>
          </div>
        );
      })}

      <div className="add-new-address-btn-container">
        <button
          className="add-new-address-btn"
          onClick={() => setIsAddressModalOpen(true)}
        >
          Add New Address
        </button>
      </div>

      {isAddressModalOpen && <AddressModal />}
    </div>
  );
};
