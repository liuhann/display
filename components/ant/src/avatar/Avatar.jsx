import { Avatar, Badge } from 'antd'
import 'antd/dist/antd.css'

export default ({
  shape = 'circle',
  icon,
  src,
  alt,
  badgeDot,
  badgeCount,
  width = 48,
  height
}) => {
  const InnerAvatar = () => {
    return (
      <Avatar size={width} shape={shape} src={src} alt={alt}>
        {alt}
      </Avatar>
    )
  }
  const Badged = () => {
    if (badgeDot) {
      return (
        <Badge dot>
          <InnerAvatar />
        </Badge>
      )
    } else if (badgeCount) {
      return (
        <Badge count={badgeCount}>
          <InnerAvatar />
        </Badge>
      )
    } else {
      return <InnerAvatar />
    }
  }

  return <Badged />
}
