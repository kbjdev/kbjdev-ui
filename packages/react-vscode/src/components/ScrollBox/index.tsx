import React, {
  FC,
  MouseEventHandler,
  PropsWithChildren,
  UIEventHandler,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import styled, { css } from 'styled-components';
import minmax from '../../utils/math/minmax';

type SliderSize = 'small' | 'large';
type ScrollDirection = 'vertical' | 'horizontal';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Container = styled.div<{ $isHorizontal: boolean }>`
  width: 100%;
  height: 100%;
  overflow-x: ${({ $isHorizontal }) => ($isHorizontal ? 'auto' : 'hidden')};
  overflow-y: ${({ $isHorizontal }) => ($isHorizontal ? 'hidden' : 'auto')};
`;

const SliderWrapper = styled.div<{ $size: SliderSize; $isHorizontal: boolean }>`
  position: absolute;
  ${({ $isHorizontal, $size }) =>
    $isHorizontal
      ? css`
          bottom: 0;
          left: 0;
          width: 100%;
          height: ${$size === 'large' ? '14px' : '10px'};
        `
      : css`
          top: 0;
          right: 0;
          height: 100%;
          width: ${$size === 'large' ? '14px' : '10px'};
        `}

  &:active > div {
    background-color: ${({ theme }) => theme['scrollbarSlider.activeBackground']};
  }
`;

const Slider = styled(motion.div)`
  background-color: ${({ theme }) => theme['scrollbarSlider.background']};

  &:hover {
    background-color: ${({ theme }) => theme['scrollbarSlider.hoverBackground']};
  }

  &:active {
    background-color: ${({ theme }) => theme['scrollbarSlider.activeBackground']};
  }
`;

interface IScrollBoxProps {
  sliderSize?: SliderSize;
  direction?: ScrollDirection;
}

const ScrollBox: FC<PropsWithChildren<IScrollBoxProps>> = ({
  children,
  sliderSize = 'small',
  direction = 'vertical',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isSliderMoving, setIsSliderMoving] = useState(false);
  const sliderLength = useMotionValue(0);
  const sliderPosition = useMotionValue(0);
  const isHorizontal = direction === 'horizontal';

  const adjustSlider = (target: HTMLElement) => {
    const { offsetHeight, offsetWidth, scrollHeight, scrollWidth, scrollLeft, scrollTop } = target;
    const offsetLength = isHorizontal ? offsetWidth : offsetHeight;
    const scrollLength = isHorizontal ? scrollWidth : scrollHeight;

    if (offsetLength < scrollLength) {
      const scrollPosition = isHorizontal ? scrollLeft : scrollTop;
      const length = (offsetLength / scrollLength) * offsetLength;
      const percent = scrollPosition / (scrollLength - offsetLength);
      sliderLength.set(length);
      sliderPosition.set((offsetLength - length) * percent);
      setIsOverflow(true);
    } else {
      setIsOverflow(false);
    }
  };

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    adjustSlider(containerRef.current);

    const resizeObserver = new ResizeObserver(([entry]) => {
      adjustSlider(entry.target as HTMLElement);
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMouseEnter = () => {
    setIsHover(true);
  };

  const onMouseLeave = () => {
    setIsHover(false);
  };

  const onScroll: UIEventHandler<HTMLDivElement> = (event) => {
    adjustSlider(event.currentTarget);
  };

  const handleScrollMouseMove = (initialPosition: number, initialScrollPosition: number) => {
    setIsSliderMoving(true);

    const onMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      const { offsetHeight, offsetWidth, scrollHeight, scrollWidth } = containerRef.current;
      const offsetLength = isHorizontal ? offsetWidth : offsetHeight;
      const scrollLength = isHorizontal ? scrollWidth : scrollHeight;
      const dp = isHorizontal ? event.clientX - initialPosition : event.clientY - initialPosition;

      const length = (offsetLength / scrollLength) * offsetLength;
      const sliderMaxPosition = offsetLength - length;
      const scrollMaxLength = scrollLength - offsetLength;
      const distanceTraveled = (scrollMaxLength / sliderMaxPosition) * dp;

      const scrollPosition = minmax(0, scrollMaxLength, initialScrollPosition + distanceTraveled);

      containerRef.current.scrollTo(
        isHorizontal ? { left: scrollPosition } : { top: scrollPosition }
      );
    };

    const onMouseUp = () => {
      if (!containerRef.current) return;
      setIsSliderMoving(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onSliderMouseDown: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    if (!containerRef.current) return;
    const position = isHorizontal ? event.clientX : event.clientY;
    const { scrollTop, scrollLeft } = containerRef.current;
    const scrollPosition = isHorizontal ? scrollLeft : scrollTop;

    handleScrollMouseMove(position, scrollPosition);
  };

  const onSliderWrapperMouseDown: MouseEventHandler<HTMLDivElement> = (event) => {
    if (!containerRef.current) return;
    const position = isHorizontal ? event.clientX : event.clientY;
    const { offsetHeight, offsetWidth, scrollHeight, scrollWidth } = containerRef.current;
    const { x, y } = containerRef.current.getBoundingClientRect();
    const offsetLength = isHorizontal ? offsetWidth : offsetHeight;
    const scrollLength = isHorizontal ? scrollWidth : scrollHeight;
    const offsetPosition = isHorizontal ? x : y;
    const length = (offsetLength / scrollLength) * offsetLength;

    const sliderPosition = position - offsetPosition - length / 2;
    const sliderMaxPosition = offsetLength - length;
    const scrollMaxLength = scrollLength - offsetLength;

    const scrollPosition = minmax(
      0,
      scrollMaxLength,
      (sliderPosition / sliderMaxPosition) * scrollMaxLength
    );

    containerRef.current.scrollTo(
      isHorizontal ? { left: scrollPosition } : { top: scrollPosition }
    );

    handleScrollMouseMove(position, scrollPosition);
  };

  return (
    <Wrapper onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Container ref={containerRef} $isHorizontal={isHorizontal} onScroll={onScroll}>
        {children}
      </Container>
      <AnimatePresence>
        {isOverflow && (
          <SliderWrapper
            $size={sliderSize}
            $isHorizontal={isHorizontal}
            onMouseDown={onSliderWrapperMouseDown}
          >
            {(isHover || isSliderMoving) && (
              <Slider
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.2 } }}
                exit={{ opacity: 0, transition: { duration: 1 } }}
                onMouseDown={onSliderMouseDown}
                style={{
                  width: isHorizontal ? sliderLength : '100%',
                  height: isHorizontal ? '100%' : sliderLength,
                  x: isHorizontal ? sliderPosition : undefined,
                  y: isHorizontal ? undefined : sliderPosition,
                }}
              />
            )}
          </SliderWrapper>
        )}
      </AnimatePresence>
    </Wrapper>
  );
};

export default ScrollBox;
