import React from 'react'
import * as d3 from 'd3'

export default ({
  series = [10, 19, 27, 34, 40, 45, 49, 52, 54, 55, 55],
  colorFrom = 'brown',
  width = 1200,
  height = 300
}) => {
  const ref = React.createRef()

  return (
    <div ref={ref}>
      <div>
        d3.cumsum([1, 2, 3, 4]): {d3.cumsum([1, 2, 3, 4]).join(',')}
      </div>
      <div>
        d3.mean([83, 32, 14, 52, 31, 66, 12, 11, 0, 78, 60, 97, 47, 37, 91, 58, 48, 55, 98, 45, 64, 1, 17, 39, 82, 24, 5, 40, 61, 27, 57, 34, 56, 26, 30, 36, 43, 80, 85, 68, 75, 50, 59, 44, 18, 19, 88, 87, 41, 90, 4, 81, 94, 89, 93, 22, 3, 67, 13, 35, 96, 16, 7, 15, 20, 76, 63, 49, 25, "95", 86, 99, 28, 62, 71, undefined, 21, 10, 72, 29, 51, 46, 73, 74, 9, 65, 77, 92, 6, 8, 2, 79, 53, 69, 70, 33, 54, 42, 23, 84, 38, NaN, "Fred"])
        {d3.mean([83, 32, 14, 52, 31, 66, 12, 11, 0, 78, 60, 97, 47, 37, 91, 58, 48, 55, 98, 45, 64, 1, 17, 39, 82, 24, 5, 40, 61, 27, 57, 34, 56, 26, 30, 36, 43, 80, 85, 68, 75, 50, 59, 44, 18, 19, 88, 87, 41, 90, 4, 81, 94, 89, 93, 22, 3, 67, 13, 35, 96, 16, 7, 15, 20, 76, 63, 49, 25, '95', 86, 99, 28, 62, 71, undefined, 21, 10, 72, 29, 51, 46, 73, 74, 9, 65, 77, 92, 6, 8, 2, 79, 53, 69, 70, 33, 54, 42, 23, 84, 38, NaN])}

      </div>
    </div>
  )
}
