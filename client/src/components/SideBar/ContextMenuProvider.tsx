import React, { createContext, useContext, useState } from "react";

interface ContextMenuValue {
  ModalState: boolean;
  categoryState: boolean;
  openModal: () => void;
  closeModal: () => void;
  openModalCategory: () => void;
  closeModalCategory: () => void;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>> | undefined;
  setCategoryState: React.Dispatch<React.SetStateAction<boolean>> | undefined;
}

const ContextMenu = createContext<ContextMenuValue>({
  ModalState: false,
  categoryState: false,
  openModal: () => {},
  closeModal: () => {},
  openModalCategory: () => {},
  closeModalCategory: () => {},
  setOpenModal: undefined,
  setCategoryState: undefined,
});

export function ContextMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ModalState, setOpenModal] = useState(false);
  const [categoryState, setCategoryState] = useState(false);
  const openModal = () => setOpenModal(true);
  const closeModal = () => setOpenModal(false);
  const openModalCategory = () => setCategoryState(true);
  const closeModalCategory = () => setCategoryState(false);

  return (
    <ContextMenu.Provider
      value={{
        ModalState,
        setOpenModal,
        openModal,
        closeModal,
        categoryState,
        setCategoryState,
        openModalCategory,
        closeModalCategory,
      }}
    >
      {children}
    </ContextMenu.Provider>
  );
}

export const useMenu = () => useContext(ContextMenu);
