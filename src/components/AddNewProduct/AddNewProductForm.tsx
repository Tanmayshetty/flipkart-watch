import { useState } from 'react';
const AddNewProductForm = () => {
  const [formData, setFormData] = useState({
    url: '',
    type: '',
    priceNotify: '',
  });
  const onProductDataChange = (event: React.FormEvent<EventTarget>) => {
    const { name, value } = event.target as HTMLInputElement;
    setFormData({ ...formData, [name]: value });
  };

  const addProductAPICall = async (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    const APIURL = '/api/addProduct';
    const rawResponse = await fetch(APIURL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    await rawResponse.json();
    document.getElementById('addNewProductModal').close();
  };

  return (
    <form method='POST' onSubmit={addProductAPICall}>
      <label className='form-control w-full max-w-xs pb-4'>
        <div className='label'>
          <span className='label-text'>Product URL</span>
        </div>
        <input
          type='text'
          name='url'
          placeholder='Type here'
          className='input input-bordered w-full max-w-xs'
          onChange={onProductDataChange}
          value={formData.url}
        />
      </label>
      <label className='form-control w-full max-w-xs pb-4'>
        <div className='label'>
          <span className='label-text'>Product Type </span>
        </div>
        <select
          className='select select-bordered'
          name='type'
          onChange={onProductDataChange}
          defaultValue={formData.type}
        >
          <option disabled selected>
            Pick one
          </option>
          <option>Fans</option>
          <option>Routers</option>
          <option>Microwave Ovens</option>
          <option>Geaser</option>
          <option>Chimney</option>
          <option>Water Purifier</option>
          <option>Kitchen Sinks</option>
          <option>Other</option>
        </select>
      </label>
      <label className='form-control w-full max-w-xs pb-4'>
        <div className='label'>
          <span className='label-text'>Product Price Notify</span>
        </div>
        <input
          type='number'
          placeholder='Type here'
          className='input input-bordered w-full max-w-xs'
          name='priceNotify'
          onChange={onProductDataChange}
          value={formData.priceNotify}
        />
      </label>
      <button className='btn mr-8' type='submit'>
        Submit
      </button>
      {/* if there is a button in form, it will close the modal */}
      <button
        className='btn'
        type='button'
        onClick={() => {
          document.getElementById('addNewProductModal').close();
        }}
      >
        Close
      </button>
    </form>
  );
};

export default AddNewProductForm;
