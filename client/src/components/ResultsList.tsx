import React from 'react';
import { List, SpinLoading } from 'antd-mobile';
import { AddCircleOutline } from 'antd-mobile-icons';
import { ItemDetails } from '../types';

interface ResultsListProps {
  items: ItemDetails[];
  isLoading: boolean;
  onSelectItem: (item: ItemDetails) => void;
}

export const ResultsList: React.FC<ResultsListProps> =
  ({items, isLoading, onSelectItem}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full min-h-56">
        <SpinLoading style={{ '--size': '48px' }} />
      </div>
    );
  }

  const emptyListItem = () => (
    <List.Item>
      <div className="flex justify-center items-center min-h-12">
        <p className="text-center text-sm">No results</p>
      </div>
    </List.Item>
  );

  return (
    <List header="Results" className="mt-4">
      {!items.length && emptyListItem()}
      {items.map((item: ItemDetails) => (
        <List.Item
          arrowIcon={<AddCircleOutline className="ml-4" color="green" fontSize={24} />}
          key={item.uniqueCode}
          extra={item.uniqueCode}
          clickable
          onClick={() => onSelectItem(item)}
        >
          <div className="flex justify-start flex-col">
            <small>{item.price}</small>
            {item.title}
          </div>
        </List.Item>
      ))}
    </List>
  );
};