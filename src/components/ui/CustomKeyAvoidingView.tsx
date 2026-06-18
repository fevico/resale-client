import React, { FC, ReactNode } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native'

interface Props {
    children: ReactNode
}

const CustomKeyAvoidingView : FC<Props> = ({children}) => {
  return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
        <ScrollView> 
            {children}
        </ScrollView>
        </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default CustomKeyAvoidingView