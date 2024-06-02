import { Button } from 'react-bootstrap';
import { useProductContext } from '../Context/ProductPageContext';


export function StatusPage() {
    const { products, updateStatus, deleteProduct } = useProductContext();

    const handleStatusChange = (productId: string, status: 'active' | 'rejected') => {
      updateStatus(productId, status);
    };
  
  /*   const handleDelete = (productId: string) => {
      deleteProduct(productId);
    };
   */

  return (
    <div className="flex justify-center">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-center">Product</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-center">Status</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="py-2 px-4 border-b border-gray-200 text-center">{product.name}</td>
              <td className="py-2 px-4 border-b border-gray-200 text-center">{product.status}</td>
              <td className="py-2 px-4 border-b border-gray-200 text-center">
                <div className="inline-flex">
                  <Button variant="outline-primary" className="mr-2" onClick={() => handleStatusChange(product.id, 'active')}>Approve</Button>
                  <Button variant="outline-danger" onClick={() => handleStatusChange(product.id, 'rejected')}>Reject</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



