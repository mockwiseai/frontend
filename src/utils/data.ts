export const demoQuestion = {

    "title": "Two Sum",
    "difficulty": "easy",
    "description": "Given an array of integers nums and an integer target, return indices of two numbers that add up to target. Each input has exactly one solution.",
    "examples": [{
        "input": "nums = [2,7,11,15], target = 9",
        "output": "[0,1]",
        "explanation": "Because nums[0] + nums[1] == 9"
    }],
    "starterCode": {
        "python": "def twoSum(nums: List[int], target: int) -> List[int]:\n    # Write your code here\n    pass",
        "javascript": "function twoSum(nums, target) {\n    // Write your code here\n    return [];\n}",
        "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}",
        "cpp": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n        return {};\n    }\n};"
    },
    "testCases": [
        {
            "input": "[2,7,11,15], 9",
            "output": "[0,1]",
            "isHidden": false
        },
        {
            "input": "[3,2,4], 6",
            "output": "[1,2]",
            "isHidden": false
        },
        {
            "input": "[3,3], 6",
            "output": "[0,1]",
            "isHidden": true
        }
    ]
}