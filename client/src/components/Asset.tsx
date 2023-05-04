import React, { Suspense, lazy, useState } from 'react';
import SectionLoader from './SectionLoader/SectionLoader';

const Modal = lazy(() => import('plaid-threads/Modal'));
const ModalBody = lazy(() => import('plaid-threads/ModalBody'));
const Button = lazy(() => import('plaid-threads/Button'));
const TextInput = lazy(() => import('plaid-threads/TextInput'));
const NumberInput = lazy(() => import('plaid-threads/NumberInput'));

interface Props {
  userId: string;
}

//  Allows user to input their personal assets such as a house or car.

export default function Asset(props: Props) {
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setShow(false);
    setDescription('');
    setValue('');
  };

  return (
    <Suspense fallback={<SectionLoader />}>
      <div className="assetBtnContainer">
        <Button centered inline small secondary onClick={() => setShow(!show)}>
          Add An Asset
        </Button>
        <Modal isOpen={show} onRequestClose={() => setShow(false)}>
          <>
            <ModalBody
              header="Enter Your Asset"
              isLoading={false}
              onClickCancel={() => setShow(false)}
            >
              <form onSubmit={handleSubmit}>
                <TextInput
                  required
                  label=""
                  id="id-6"
                  placeholder="Enter Asset Description (e.g. house or car)"
                  value={description}
                  onChange={(e) => setDescription(e.currentTarget.value)}
                />
                <NumberInput
                  required
                  label=""
                  id="id-6"
                  placeholder="Enter Asset Value (in dollars $)"
                  value={value}
                  onChange={(e) => setValue(e.currentTarget.value)}
                />
                <Button wide type="submit">
                  Submit
                </Button>
              </form>
            </ModalBody>
          </>
        </Modal>
      </div>
    </Suspense>
  );
}
