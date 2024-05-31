import { Button } from 'react-bootstrap';
import { useProductContext } from '../Context/ProductPageContext';
import { useEffect, useState } from 'react';



function StatusUpDate() {
    const {products, approveProduct, rejectProduct} = useProductContext();
    const [pendingProducts, setPendingProducts] = useState(products.filter((product)=> product.status === "pending")
    )
  
    
    useEffect(()=>{
        setPendingProducts(products.filter((product)=> product.status === "pending"))
    },[products])
  return (
    <div className="flex justify-center my-32">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-center">Product</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-center">Status</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingProducts.map((product) => (
            <tr key={product.id}>
              <td className="py-2 px-4 border-b border-gray-200 text-center">{product.name}</td>
              <td className="py-2 px-4 border-b border-gray-200 text-center">{product.status}</td>
              <td className="py-2 px-4 border-b border-gray-200 text-center">
                <div className="inline-flex">
                  <Button variant="outline-primary" className="mr-2" onClick={()=> approveProduct(product.id)}>Approve</Button>
                  <Button variant="outline-danger" onClick={()=> rejectProduct(product.id)}>Reject</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StatusUpDate;
