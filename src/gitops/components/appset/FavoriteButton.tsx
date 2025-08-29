import * as React from 'react';
import { Button, Tooltip, Form, FormGroup, TextInput, FormHelperText, HelperText, HelperTextItem } from '@patternfly/react-core';
import { Modal, ModalVariant } from '@patternfly/react-core/deprecated';
import { StarIcon } from '@patternfly/react-icons';

type FavoriteButtonProps = {
  defaultName?: string;
};

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ defaultName }) => {
  const [isStarred, setIsStarred] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [name, setName] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);

  // Check if this page is already favorited on mount
  React.useEffect(() => {
    const currentUrlPath = window.location.pathname;
    const favorites = JSON.parse(localStorage.getItem('console-favorites') || '[]');
    const isCurrentlyFavorited = favorites.some((favorite: any) => favorite.url === currentUrlPath);
    setIsStarred(isCurrentlyFavorited);
  }, []);

  const handleStarClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const currentUrlPath = window.location.pathname;
    const favorites = JSON.parse(localStorage.getItem('console-favorites') || '[]');
    const isCurrentlyFavorited = favorites.some((favorite: any) => favorite.url === currentUrlPath);
    
    if (isCurrentlyFavorited) {
      // Remove from favorites
      const updatedFavorites = favorites.filter((favorite: any) => favorite.url !== currentUrlPath);
      localStorage.setItem('console-favorites', JSON.stringify(updatedFavorites));
      setIsStarred(false);
    } else {
      // Open modal to add to favorites
      const currentUrlSplit = currentUrlPath.includes('~')
        ? currentUrlPath.split('~')
        : currentUrlPath.split('/');
      const sanitizedDefaultName = (
        defaultName ?? currentUrlSplit.slice(-1)[0].split('?')[0]
      ).replace(/[^\p{L}\p{N}\s-]/gu, '-');
      setName(sanitizedDefaultName);
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setError('');
    setName('');
    setIsModalOpen(false);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setError('');
  };

  const handleConfirmStar = () => {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      setError('Name is required');
      return;
    }

    if (trimmedName.length > 50) {
      setError('Name must be 50 characters or less');
      return;
    }

    // Check for duplicate names
    const favorites = JSON.parse(localStorage.getItem('console-favorites') || '[]');
    const isDuplicate = favorites.some((favorite: any) => favorite.name === trimmedName);
    
    if (isDuplicate) {
      setError('A favorite with this name already exists');
      return;
    }

    // Add to favorites
    const currentUrlPath = window.location.pathname;
    const newFavorite = {
      url: currentUrlPath,
      name: trimmedName,
    };
    const updatedFavorites = [...favorites, newFavorite];
    localStorage.setItem('console-favorites', JSON.stringify(updatedFavorites));
    setIsStarred(true);
    handleModalClose();
  };

  const tooltipText = isStarred ? 'Remove from favorites' : 'Add to favorites';

  return (
    <>
      <div className="co-fav-actions-icon">
        <Tooltip content={tooltipText} position="top">
          <Button
            icon={<StarIcon color={isStarred ? 'gold' : 'gray'} />}
            className="co-xl-icon-button"
            data-test="favorite-button"
            variant="plain"
            aria-label={tooltipText}
            aria-pressed={isStarred}
            onClick={handleStarClick}
          />
        </Tooltip>
      </div>

      {isModalOpen && (
        <Modal
          title="Add to favorites"
          isOpen={isModalOpen}
          onClose={handleModalClose}
          variant={ModalVariant.small}
          actions={[
            <Button
              key="confirm"
              variant="primary"
              onClick={handleConfirmStar}
              form="confirm-favorite-form"
            >
              Save
            </Button>,
            <Button key="cancel" variant="link" onClick={handleModalClose}>
              Cancel
            </Button>,
          ]}
        >
          <Form id="confirm-favorite-form" onSubmit={handleConfirmStar}>
            <FormGroup label="Name" isRequired fieldId="input-name">
              <TextInput
                id="confirm-favorite-form-name"
                data-test="input-name"
                name="name"
                type="text"
                onChange={(e, v) => handleNameChange(v)}
                value={name || ''}
                autoFocus
                required
              />
              {error && (
                <FormHelperText>
                  <HelperText>
                    <HelperTextItem variant="error">
                      {error}
                    </HelperTextItem>
                  </HelperText>
                </FormHelperText>
              )}
            </FormGroup>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default FavoriteButton;
