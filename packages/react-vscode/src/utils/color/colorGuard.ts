import { Color } from '../vs/color';

function colorGuard(
  color: string | undefined,
  defaultColor: string = Color.transparent.toString()
) {
  return color ?? defaultColor;
}

export default colorGuard;
