<script lang="ts">
  import {Container, Form, Checkbox, Radio, Label, FileInput, Input, Toggle, Select, HelperText} from "$lib";
  let data = [
    { text: "Option 1", value: "1" },
    { text: "Option 2", value: "2", selected: true },
    { text: "Option 3 (Disabled)", value: "3", disabled: true }
  ]
</script>

<Container>
  <Form>
    <Checkbox name="terms">I agree to the terms and conditions</Checkbox>
    <Radio name="gender">Male</Radio>
    <Radio name="gender">Female</Radio>
    <Label label="Username" id="username"/>
    <FileInput name="document">Upload</FileInput>
    <Input type="text" name="username" placeholder="Enter your username">Username</Input>
    <Input type="email" name="email" placeholder="Enter your email">Email</Input>
    <Input type="password" name="password" placeholder="Enter your password">Password</Input>
    <Input type="date" name="dob">Date of birth</Input>
    <Input type="url" name="url" placeholder="Enter your profile URL">URL</Input>
    <Input type="number" name="days" placeholder="Enter numbers">Number of days</Input>
    <HelperText content="Please enter your full name." />
    <!-- Checkbox (default) -->
    <Toggle name="toggle1" type="checkbox">Checkbox 1</Toggle>
    <Toggle name="toggle2" type="checkbox">Checkbox 2</Toggle>

    <!-- Radio buttons -->
    <Toggle name="toggle3" type="radio">Radio button 1</Toggle>
    <Toggle name="toggle3" type="radio">Radio button 2</Toggle>
    <Select label="Select an option" options={data} />
  </Form>
</Container>