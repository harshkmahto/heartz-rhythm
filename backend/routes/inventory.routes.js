import { Router } from 'express'





import { authorized, isSeller, protect } from '../middleware/auth.middleware.js';
import { bulkDeleteDraftInventory, createDraftInventory, createInventoryNote, deleteDrafInventory, deleteInventoryNote, getAllDraftInventory, getAllInventory, getInventoryNoteByProduct, getSingleDrafInventory, updateDrafInventory, updateInventoryNote } from '../controller/inventory.controller.js';



const inventoryRoute = Router();

inventoryRoute.use(authorized, isSeller, protect)

//--------------------INVENTORY----------------------
inventoryRoute.get('/inventory/notes', getAllInventory)
inventoryRoute.post('/create/inventory-notes', createInventoryNote)
inventoryRoute.patch('/update/inventory-notes/:noteId', updateInventoryNote)
inventoryRoute.delete('/delete/inventory-notes/:noteId', deleteInventoryNote)


// -------------DRAFT INVENTORY----------------
inventoryRoute.post('/create-inventory', createDraftInventory)
inventoryRoute.patch('/update-inventory/:noteId', updateDrafInventory)
inventoryRoute.delete('/delete-inventory/:noteId', deleteDrafInventory)
inventoryRoute.post('/delete-all', bulkDeleteDraftInventory)
inventoryRoute.get('/inventory', getAllDraftInventory)
inventoryRoute.get('/inventory/:noteId', getSingleDrafInventory)







export default inventoryRoute;