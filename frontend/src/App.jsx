import React, { useState } from 'react';
import {
  Button,
  Input,
  Flex,
  Box,
  Text,
  VStack,
  Divider,
  Heading,
  useColorMode,
} from '@chakra-ui/react';

function App() {
  const [githubUrl, setGithubUrl] = useState('');
  const [insights, setInsights] = useState([]);
  const { colorMode, toggleColorMode } = useColorMode();
  console.log(import.meta.env.VITE_APP_GITHUB_TOKEN)
  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          github_url: githubUrl,
          github_token: import.meta.env.VITE_APP_GITHUB_TOKEN,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setInsights(result.insights);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
    <Box p={8} maxWidth="900px" mx="auto">
      <Heading as="h2" size="xl" mb={6} textAlign="center" color="teal.500">
        CodeInsight - Get GitHub Repository Information
      </Heading>
      <Heading as="h4" size="md" mb={6} textAlign="center" color="red.500">
        Please go through the README file of this Repository before submitting the Link!
      </Heading>
      <Button onClick={toggleColorMode} mb={4}>
        Toggle {colorMode === 'light' ? 'Dark' : 'Light'} Mode
      </Button>

      <VStack spacing={4}>
        <Text fontWeight="bold" fontSize="lg">
          Enter GitHub Link:
        </Text>
        <Input
          placeholder="GitHub URL Link"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          variant="filled"
        />

        <Box
          p={4}
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          h="500px"
          bg="white"
          boxShadow="md"
          mt={4}
          minW={'100%'}
          overflowY="auto"
        >
          {insights.map((insight, index) => (
            <Box key={index} mb={4}>
              <Text fontWeight="bold" mb={2} fontSize="lg" color="teal.500">
                File: {insight.file}
              </Text>
              <Divider />
              <Text fontWeight="bold" fontSize="md" color="gray.700" mb={2}>
                Suggestions:
              </Text>
              <Box
                bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
                p={3}
                borderRadius="md"
              >
                <Text fontSize="md" color={colorMode === 'light' ? 'black' : 'white'}>
                  {insight.suggestions.split('\n').map((line, index) => (
                    <div key={index}>
                      {line.split(/\*\*(.*?)\*\*/).map((segment, idx) => (
                        idx % 2 === 1 ? (
                          <Text key={idx} as="span" fontWeight="bold">
                            {segment}
                          </Text>
                        ) : (
                          <span key={idx}>{segment}</span>
                        )
                      ))}
                    </div>
                  ))}
                </Text>
              </Box>
            </Box>
          ))}
        </Box>
      </VStack>

      <Button
        colorScheme="green"
        onClick={handleSave}
        mt={6}
        width="100%"
        fontSize="lg"
      >
        Submit
      </Button>
    </Box>
    </>
  );
}

export default App;
