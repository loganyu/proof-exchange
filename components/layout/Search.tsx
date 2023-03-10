import * as React from 'react';
import {styled} from 'baseui';
import {Select, Value} from 'baseui/select';
import {expandBorderStyles} from 'baseui/styles';
import {
  ThemeProvider,
  createTheme,
  darkThemePrimitives
} from "baseui";

const ColorSwatch = styled<'div', {$color: string}>(
  'div',
  (props) => {
    return {
      width: props.$theme.sizing.scale300,
      height: props.$theme.sizing.scale300,
      marginRight: props.$theme.sizing.scale200,
      display: 'inline-block',
      backgroundColor: props.$color,
      verticalAlign: 'baseline',
      ...expandBorderStyles(props.$theme.borders.border400),
    };
  },
);
const getLabel = ({option}: any) => {
  return (
    <React.Fragment>
      <ColorSwatch $color={option.color} />
      {option.id}
    </React.Fragment>
  );
};
function CustomLabel() {
  const [value, setValue] = React.useState<Value>([]);
  return (
    <ThemeProvider
      theme={createTheme(darkThemePrimitives, {
        colors: { inputFillDisabled: "#FFA629" }
      })}
    >
      <Select
        options={[
          {id: 'AliceBlue', color: '#F0F8FF'},
          {id: 'AntiqueWhite', color: '#FAEBD7'},
          {id: 'Aqua', color: '#00FFFF'},
          {id: 'Aquamarine', color: '#7FFFD4'},
          {id: 'Azure', color: '#F0FFFF'},
          {id: 'Beige', color: '#F5F5DC'},
        ]}
        disabled
        placeholder="Search (coming soon)"
        labelKey="id"
        valueKey="color"
        onChange={(options) => setValue(options.value)}
        value={value}
        getOptionLabel={getLabel}
        getValueLabel={getLabel}
      />
    </ThemeProvider>

  );
}
export default CustomLabel;