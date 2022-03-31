//本质是数学(
export class EaseUtil {




    static EaseInSine(currentTime: number, startValue: number, endValue: number, duration: number): number {
        function easeInSine(x: number): number {
            return 1 - Math.cos((x * Math.PI) / 2);
        }

        return easeInSine(currentTime / duration) * (endValue - startValue) + startValue;
    }

    static EaseInOutSine(currentTime: number, startValue: number, endValue: number, duration: number): number {
        function easeInOutSine(x: number): number {
            return -(Math.cos(Math.PI * x) - 1) / 2;
        }

        return easeInOutSine(currentTime / duration) * (endValue - startValue) + startValue;
    }

    static EaseOutSine(currentTime: number, startValue: number, endValue: number, duration: number): number {
        function easeOutSine(x: number): number {
            return Math.sin((x * Math.PI) / 2);
        }

        return easeOutSine(currentTime / duration) * (endValue - startValue) + startValue;
    }

    static EaseInCubic(currentTime: number, startValue: number, endValue: number, duration: number): number {
        function easeInCubic(x: number): number {
            return x * x * x;
        }

        return easeInCubic(currentTime / duration) * (endValue - startValue) + startValue;
    }

    static EaseOutCubic(currentTime: number, startValue: number, endValue: number, duration: number): number {
        function easeOutCubic(x: number): number {
            return 1 - Math.pow(1 - x, 3);
        }

        return easeOutCubic(currentTime / duration) * (endValue - startValue) + startValue;
    }

    static EaseInOutCubic(currentTime: number, startValue: number, endValue: number, duration: number): number {
        function easeInOutCubic(x: number): number {
            return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
        }

        return easeInOutCubic(currentTime / duration) * (endValue - startValue) + startValue;
    }

    static EaseInQuart(currentTime: number, startValue: number, endValue: number, duration: number): number {
        function easeInQuart(x: number): number {
            return x * x * x * x;
        }

        return easeInQuart(currentTime / duration) * (endValue - startValue) + startValue;
    }

    static EaseOutQuart(currentTime: number, startValue: number, endValue: number, duration: number): number {
        function easeOutQuart(x: number): number {
            return 1 - Math.pow(1 - x, 4);
        }

        return easeOutQuart(currentTime / duration) * (endValue - startValue) + startValue;
    }

    static EaseInOutQuart(currentTime: number, startValue: number, endValue: number, duration: number): number {
        function easeInOutQuart(x: number): number {
            return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
        }

        return easeInOutQuart(currentTime / duration) * (endValue - startValue) + startValue;
    }

}
