import { Image, Text, View } from 'react-native';
import { colors } from '../styles/theme';

type BrandMarkProps = { compact?: boolean; dark?: boolean; vertical?: boolean };

export default function BrandMark({
  compact = false,
  dark = false,
  vertical = false,
}: BrandMarkProps) {
  return (
    <View
      style={{
        flexDirection: vertical ? 'column' : 'row',
        alignItems: 'center',
        width: vertical ? '100%' : undefined,
      }}
    >
      <Image
        source={require('../../assets/AppLogo3.png')}
        style={{
          width: compact ? 42 : 76,
          height: compact ? 42 : 76,
          marginRight: vertical ? 0 : compact ? 10 : 14,
        }}
        resizeMode="contain"
      />
      <View style={{ alignItems: vertical ? 'center' : 'flex-start', flexShrink: 1, maxWidth: '100%' }}>
        <Text
          style={{
            color: dark ? colors.surface : colors.maroon,
            fontSize: compact ? 15 : 19,
            fontWeight: '800',
            letterSpacing: 0.2,
            textAlign: vertical ? 'center' : 'left',
            flexShrink: 1,
          }}
        >
          SCHOOL ATTENDANCE
        </Text>
        {!compact ? (
          <Text
            style={{
              color: dark ? colors.yellow : colors.muted,
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 1.2,
              marginTop: 2,
              textAlign: vertical ? 'center' : 'left',
            }}
          >
            EVENT MANAGEMENT
          </Text>
        ) : null}
      </View>
    </View>
  );
}
