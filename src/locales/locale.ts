export type Locale = 'en_US' | 'pl_PL'

interface LocaleSet {
  EMBED_TITLE: string
  CREATED_AT: string
  STARTED_PROCESSING: string
  NO_ATTACHMENTS: string
  TOTAL_AMOUNT_DUE: string
  COMMAND_ERROR: string
  DM_SUCCESS: string
}

export const locales = {
  en_US: {
    EMBED_TITLE: 'New invoice by',
    CREATED_AT: 'Created on',
    STARTED_PROCESSING: 'Started processing your images...',
    NO_ATTACHMENTS: 'No attachments found',
    TOTAL_AMOUNT_DUE: 'Total amount due',
    COMMAND_ERROR: 'An error occured while running the command',
    DM_SUCCESS: 'Successfully sent the data to the user',
  },
  pl_PL: {
    EMBED_TITLE: 'Nowe rozliczenie od',
    CREATED_AT: 'Utworzono',
    STARTED_PROCESSING: 'Rozpoczęto przetwarzanie obrazów...',
    NO_ATTACHMENTS: 'Nie znaleziono załączników',
    TOTAL_AMOUNT_DUE: 'Kwota do zapłaty',
    COMMAND_ERROR: 'Wystąpił błąd podczas uruchamiania komendy',
    DM_SUCCESS: 'Pomyślnie wysłano dane do użytkownika',
  },
} satisfies Record<Locale, LocaleSet>
