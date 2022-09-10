import omit from 'lodash/omit';
import { useRouter } from 'next/router';
import React, { useContext, useRef, useState } from 'react';
import Cropper from 'react-cropper';
import { FormattedMessage, useIntl } from 'react-intl';
import { mutate } from 'swr';
import { AuthAndApiContext, ToastsContext } from '../../contexts';
import Button from '../Button';
import Errors from '../Errors';
import Modal from '../Modal';
import styles from './AvatarUpdateModal.module.css';
import { ReactComponent as Attach } from './attach.svg';

const size = 400;

export default function AvatarUpdateModal() {
  const router = useRouter();
  const intl = useIntl();
  const { api } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);

  const input = useRef<HTMLInputElement>(null);
  const cropper = useRef<HTMLImageElement>(null);

  const [inProgress, setInProgress] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, Array<string>> | null>(null);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setErrors(null);

    const { files } = event.target;

    if (files === null || files.length !== 1) {
      setUploadedImage(null);

      return;
    }

    const reader = new FileReader();

    reader.readAsDataURL(files[0]);

    reader.addEventListener('load', async () => {
      if (reader.result === null) return;

      setUploadedImage(reader.result.toString());
    });
  }

  async function handleSetAvatar() {
    setInProgress(true);
    (cropper.current as any)?.cropper?.disable();

    if (cropper.current === null) {
      setInProgress(false);

      return;
    }

    const imageElement: any = cropper.current;
    const cropperCanvas: HTMLCanvasElement | null = imageElement.cropper.getCroppedCanvas();
    const scaledCanvas = document.createElement('canvas');

    scaledCanvas.width = size;
    scaledCanvas.height = size;

    const scaledCanvasContext = scaledCanvas.getContext('2d');

    if (scaledCanvasContext === null || cropperCanvas === null) {
      setInProgress(false);

      return;
    }

    scaledCanvasContext.scale(size / cropperCanvas.width, size / cropperCanvas.height);
    scaledCanvasContext.drawImage(cropperCanvas, 0, 0);

    const response = await api.patch('/users/me/', { avatar: scaledCanvas.toDataURL('image/png') });
    const responseJson = await response.json();

    if (response.ok) {
      await mutate('/users/me/', responseJson);
      addToast({ content: intl.formatMessage({ defaultMessage: 'Your avatar is updated.' }), kind: 'success' });

      await router.replace({ pathname: router.pathname, query: omit(router.query, 'action') });

      setUploadedImage(null);
    } else {
      setErrors(responseJson);
    }

    setInProgress(false);
    (cropper.current as any)?.cropper?.enable();
  }

  return (
    <Modal
      actions={uploadedImage === null ? undefined : (
        <>
          <Button
            disabled={inProgress}
            onClick={() => {
              setErrors(null);
              setUploadedImage(null);
            }}
            type="button"
            variant="secondary"
          >
            <FormattedMessage defaultMessage="Start Over" />
          </Button>

          <Button disabled={inProgress} onClick={handleSetAvatar} type="button">
            <FormattedMessage defaultMessage="Update Avatar" />
          </Button>
        </>
      )}
      className={styles.avatarUpdateModal}
      isOpen={router.query.action === 'updateAvatar'}
      onClose={inProgress ? undefined : async () => {
        await router.push({ pathname: router.pathname, query: { ...omit(router.query, 'action') } });

        setUploadedImage(null);
        setErrors(null);
      }}
      title={intl.formatMessage({ defaultMessage: 'Update Your Avatar' })}
    >
      {errors !== null && (
        <div className={styles.errors}>
          {Object.keys(errors).map((errorKey) => (
            <Errors errors={errors[errorKey]} key={errorKey} />
          ))}
        </div>
      )}

      {uploadedImage === null ? (
        <div className={styles.inputWrapper}>
          <input
            className={styles.input}
            name="avatar"
            onChange={handleInputChange}
            ref={input}
            type="file"
          />

          <button
            className={styles.inputButton}
            onClick={() => {
              input.current?.click();
            }}
            onDragOver={(event) => {
              event.preventDefault();
            }}
            onDrop={(event) => {
              event.preventDefault();

              if (event.dataTransfer.files.length === 1) {
                const reader = new FileReader();

                reader.addEventListener('load', (readerEvent) => {
                  if (readerEvent.target?.result) {
                    setUploadedImage(readerEvent.target.result.toString());
                  }
                });

                reader.readAsDataURL(event.dataTransfer.files[0]);
              }
            }}
            type="button"
          >
            <Attach />

            <span>
              <FormattedMessage defaultMessage="Choose a file" />
            </span>
          </button>
        </div>
      ) : (
        <Cropper
          allowTransparency
          aspectRatio={1}
          guides={false}
          initialAspectRatio={1}
          ref={cropper}
          src={uploadedImage}
          style={{ height: 400, width: '100%' }}
        />
      )}
    </Modal>
  );
}
