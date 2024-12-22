import { useRef, useState } from 'react';
import { Button, FloatingPanel, FloatingPanelRef, List, SearchBar, SpinLoading } from 'antd-mobile';
import { AddCircleOutline, CloseCircleOutline } from 'antd-mobile-icons';

const anchors = [102, 102 + 144, window.innerHeight * 0.8];

interface ItemDetails {
  title: string;
  price: string;
  uniqueCode: string;
}

export default function App() {
  const ref = useRef<FloatingPanelRef>(null);
  const [items, setItems] = useState<ItemDetails[]>([]);
  const [selectedItems, setSelectedItems] = useState<ItemDetails[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (searchValue: string) => {
    setLoading(true);
    if (ref.current) {
      ref.current.setHeight(window.innerHeight * 0.8);
    }

    const params = new URLSearchParams({
      uniqueCode: searchValue
    });
    try {
      const response = await fetch(`/api/scrape-item?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error calling the API:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnCopyToClipboard = () => {
    navigator.clipboard.writeText(selectedItems.map(item => {
      return `${item.title}\n${item.uniqueCode}\n${item.price}`;
    }).join('\n\n')).then(() => alert("Success"));
  }

  const handleSelectItem = (item: ItemDetails) => {
    setItems(prev => prev.filter(i => i.uniqueCode !== item.uniqueCode));
    setSelectedItems(prev => [...prev, item]);
  }

  const handleRemoveSelectedItem = (item: ItemDetails) => {
    setSelectedItems(prev => prev.filter(i => i.uniqueCode !== item.uniqueCode));
    setItems(prev => [...prev, item]);
  }

  const emptyListItem = () => (
    <List.Item>
      <div className="flex justify-center items-center min-h-12">
        <p className='text-center text-sm'>There are no items selected</p>
      </div>
    </List.Item>
  )

  const selectedListHeader = () => (
    <div className='flex justify-between items-center w-full'>
      <p>Item Search</p>
      <Button size='middle' color='primary' onClick={handleOnCopyToClipboard}>
        Copy to Clipboard
      </Button>
    </div>
  )

  return (
    <div>
      <List
        header={selectedListHeader()}
        className='container mx-auto m-1 bg-white rounded-lg'
      >
        {!selectedItems.length && emptyListItem()}
        {selectedItems.map((item: ItemDetails) => (
          <List.Item
            arrowIcon={(
              <CloseCircleOutline
                className="ml-4"
                color={'red'}
                fontSize={24}
              />
            )}
            key={item.uniqueCode}
            extra={item.uniqueCode}
            clickable onClick={() => handleRemoveSelectedItem(item)}>
            <div className="flex justify-start flex-col">
              <small>{item.price}</small>
              {item.title}
            </div>
          </List.Item>
        ))}
      </List>

      <FloatingPanel anchors={anchors} ref={ref}>
        <div className="mx-2">
          <SearchBar
            style={{
              '--height': '48px',
            }}
            placeholder='Search'
            onSearch={handleSubmit}
          />
          {loading ? (
            <div className='flex justify-center items-center w-full min-h-56'>
              <SpinLoading style={{ '--size': '48px' }} />
            </div>
          ) : (
            <List header='Results' className='mt-4'>
              {items.map((item: ItemDetails) => (
                <List.Item
                  arrowIcon={(
                    <AddCircleOutline
                      className='ml-4'
                      color={'green'}
                      fontSize={24}
                    />
                  )}
                  key={item.uniqueCode}
                  extra={item.uniqueCode}
                  clickable onClick={() => handleSelectItem(item)}>
                  <div className='flex justify-start flex-col'>
                    <small>{item.price}</small>
                    {item.title}
                  </div>
                </List.Item>
              ))}
            </List>
          )}
        </div>
      </FloatingPanel>
    </div>
  );
}