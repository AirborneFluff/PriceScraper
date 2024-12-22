import React from 'react';
import { List, Button, SwipeAction } from 'antd-mobile';
import { Action } from 'antd-mobile/es/components/swipe-action';
import { ItemDetails } from '../types';

interface SelectedItemsListProps {
  selectedItems: ItemDetails[];
  onRemoveItem: (item: ItemDetails) => void;
  onCopyToClipboard: () => void;
  onClear: () => void;
}

export const SelectedItemsList: React.FC<SelectedItemsListProps> =
  ({selectedItems, onRemoveItem, onCopyToClipboard, onClear}) => {
  const getActions = (item: ItemDetails): Action[] => [
    {
      key: 'remove',
      text: 'Remove',
      color: 'danger',
      onClick: () => onRemoveItem(item),
    },
  ];

  const emptyListItem = () => (
    <List.Item>
      <div className="flex justify-center items-center min-h-12">
        <p className="text-center text-sm">There are no items selected</p>
      </div>
    </List.Item>
  );

  const selectedListHeader = () => (
    <div className="flex justify-between items-center w-full">
      <p className='pr-16'>Item List</p>
      <div className='flex justify-center items-center gap-2 flex-grow'>
        <Button
          size="middle"
          color='default'
          onClick={onClear}
          disabled={!selectedItems.length}
        >
          Clear
        </Button>
        <Button
          className='flex-grow'
          size="middle"
          color="primary"
          onClick={onCopyToClipboard}
          disabled={!selectedItems.length}
        >
          Copy
        </Button>
      </div>
    </div>
  );

  return (
    <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-[102px]">
      <List header={selectedListHeader()}>
        {!selectedItems.length && emptyListItem()}
        {selectedItems.map((item) => (
          <SwipeAction key={item.uniqueCode} rightActions={getActions(item)}>
            <List.Item extra={item.uniqueCode}>
              <div className="flex justify-start flex-col">
                <small>{item.price}</small>
                {item.title}
              </div>
            </List.Item>
          </SwipeAction>
        ))}
      </List>
    </div>
  );
};