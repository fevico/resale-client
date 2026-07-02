import { FC } from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface Props {

}

const Listings: FC<Props> = (props) => {
  return (
  <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Your Listings</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {}
});

export default Listings