// @flow

const pageIndexFixture = [
  {
    type: 'Box',
    props: {
      style: {
        // // Container with max-width
        // // https://github.com/twbs/bootstrap/blob/v4-dev/scss/mixins/_grid.scss#L5
        // maxWidth: '980px',
        // marginLeft: 'auto',
        // marginRight: 'auto',
        // width: '100%',
        flex: 1, // Flex 1 to make footer sticky.
      },
      children: [
        {
          type: 'Box',
          props: {
            style: {
              backgroundColor: '#643ab7',
              paddingBottom: 0.5,
              paddingLeft: 0.5,
              paddingRight: 0.5,
              paddingTop: 0.5,
            },
            children: [
              {
                type: 'Text',
                props: {
                  style: { fontSize: 1, color: '#fff' },
                  children: ['Test'],
                },
              },
            ],
          },
        },
        {
          type: 'Box',
          props: {
            style: { flex: 1 },
            children: [
              ...Array(1) // Just for overflow scroll test.
                .fill()
                .map(() => ({
                  type: 'Text',
                  props: { style: { fontSize: 2 }, children: ['Jo!'] },
                })),
              {
                type: 'Text',
                props: {
                  children: [
                    'Ahoj ',
                    {
                      type: 'Text',
                      props: {
                        style: { fontStyle: 'italic' },
                        children: [
                          'sv',
                          {
                            type: 'Text',
                            props: {
                              style: { fontWeight: 'bold' },
                              children: ['ě'],
                            },
                          },
                          'te.',
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          type: 'Box',
          props: {
            style: {
              paddingBottom: 0.5,
              paddingLeft: 0.5,
              paddingRight: 0.5,
              paddingTop: 0.5,
            },
            children: [
              {
                type: 'Text',
                props: {
                  style: { fontSize: -1, color: '#333' },
                  children: ['footer'],
                },
              },
            ],
          },
        },
      ],
    },
  },
]

export const webFixture = {
  theme: {
    colors: {
      background: '#F9FAFB',
      foreground: '#333',
      // brand1: 'blue'
    },
    typography: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: 16,
      fontSizeScale: 1.5,
      lineHeight: 1.5,
    },
  },
  // fragmentsOrElementsOrTypesOrComponents: {
  //   Heading
  //   MainNav
  // }
  pages: {
    index: {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      elements: pageIndexFixture,
    },
  },
}
