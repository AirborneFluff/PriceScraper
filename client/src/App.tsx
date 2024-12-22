import { useState } from 'react';
import { Toast } from 'antd-mobile';
import { ItemDetails } from './types';
import { SelectedItemsList } from './components/SelectedItemsList';
import { FloatingSearchPanel } from './components/FloatingSearchPanel';

export default function App() {
  const [items, setItems] = useState<ItemDetails[]>([]);
  const [selectedItems, setSelectedItems] = useState<ItemDetails[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (searchValue: string) => {
    setLoading(true);

    const params = new URLSearchParams({
      uniqueCode: searchValue,
    });
    try {
      const response = await fetch(`/api/scrape-item?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error calling the API:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnCopyToClipboard = () => {
    navigator.clipboard
      .writeText(
        selectedItems
          .map((item) => `${item.title}\n${item.uniqueCode}\n${item.price}`)
          .join('\n\n')
      )
      .then(() =>
        Toast.show({
          position: 'top',
          content: 'Successfully copied prices',
        })
      );
  };

  const handleSelectItem = (item: ItemDetails) => {
    setSelectedItems((prev) => [...prev, item]);
  };

  const handleRemoveSelectedItem = (item: ItemDetails) => {
    setSelectedItems((prev) => prev.filter((i) => i.uniqueCode !== item.uniqueCode));
  };

  return (
    <div className="h-full overflow-hidden">
      <SelectedItemsList
        onClear={() => setSelectedItems([])}
        selectedItems={selectedItems}
        onRemoveItem={handleRemoveSelectedItem}
        onCopyToClipboard={handleOnCopyToClipboard}
      />

      <FloatingSearchPanel
        items={items.filter(
          (item) => !selectedItems.some((selectedItem) => selectedItem.uniqueCode === item.uniqueCode)
        )}
        loading={loading}
        onSubmit={handleSubmit}
        onClear={() => setItems([])}
        onSelectItem={handleSelectItem}
      />
    </div>
  );
}