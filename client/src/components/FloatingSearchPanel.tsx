import React, { useRef } from 'react';
import { FloatingPanel, FloatingPanelRef, SearchBar } from 'antd-mobile';
import { ResultsList } from './ResultsList';
import { ItemDetails } from '../types';

interface FloatingSearchPanelProps {
  items: ItemDetails[];
  loading: boolean;
  onSubmit: (value: string) => void;
  onClear: () => void;
  onSelectItem: (item: ItemDetails) => void;
}

const anchors = [102, 102 + 144, window.innerHeight * 0.8];

export const FloatingSearchPanel: React.FC<FloatingSearchPanelProps> =
  ({items, loading, onSubmit, onClear, onSelectItem}) => {
  const ref = useRef<FloatingPanelRef>(null);

  return (
    <FloatingPanel anchors={anchors} ref={ref}>
      <div className="mx-2">
        <SearchBar
          style={{
            '--height': '48px',
          }}
          placeholder="Search"
          onSearch={(value) => {
            onSubmit(value);
            if (ref.current) ref.current.setHeight(anchors[2]);
          }}
          onClear={() => {
            onClear();
            if (ref.current) ref.current.setHeight(anchors[0]);
          }}
        />
        <ResultsList items={items} isLoading={loading} onSelectItem={onSelectItem} />
      </div>
    </FloatingPanel>
  );
};