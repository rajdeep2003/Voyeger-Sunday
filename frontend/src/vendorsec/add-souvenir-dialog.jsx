"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectOption,
} from "./ui-components"

export function AddSouvenirDialog({ isOpen, onClose, newItem, setNewItem, onAdd, categories }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Souvenir</DialogTitle>
          <DialogDescription>Add a new souvenir to your inventory</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={newItem.stock}
                onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
              <SelectOption value="">Select category</SelectOption>
              {categories.slice(1).map((category) => (
                <SelectOption key={category} value={category}>
                  {category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </SelectOption>
              ))}
            </Select>
          </div>
          <Button onClick={onAdd} className="w-full">
            Add Souvenir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
