<script lang="ts">
  import { Accordion, AccordionItem, Alert, Badge, Container, DarkMode, ListGroup, ListItem,Drawer, Dropdown, DropdownItem, Modal, Qab, QabButton } from "$lib";
</script>

<Container>

  <Accordion flush>
    <AccordionItem title="Human Psychology Fact: 1">
      ...
    </AccordionItem>
    <AccordionItem title="Human Psychology Fact: 2">
      ...
    </AccordionItem>
  </Accordion>

  <div class="flex items-center gap-8">
    <p class="relative p-2 bg-secondary">
      Notifications <Badge fixed />
    </p>
    <p class="relative p-2 bg-secondary">
      Notifications <Badge fixed>New</Badge>
    </p>
  </div>
  <Alert icon>Hello</Alert>

  <Qab>
    <QabButton url="/"></QabButton>
    <QabButton url="/"></QabButton>
    <QabButton url="/"></QabButton>
  </Qab>
  <br>
  <br>
  <DarkMode />
  <br>
  <br>
  <ListGroup>
    <ListItem>First Item</ListItem>
    <ListItem>Second Item</ListItem>
    <ListItem>Third Item</ListItem>
  </ListGroup>
  <br>
  <br>
  <Drawer label="Open Drawer">
    <div class="p-8">
      Drawer content
    </div>
  </Drawer>
  <Dropdown label="Dropdown">
    <DropdownItem url="/">Link 1</DropdownItem>
    <DropdownItem url="/">Link 2</DropdownItem>
    <DropdownItem url="/">Link 3</DropdownItem>
  </Dropdown>
  <Modal label="Modal Button">
    Hello Modal!
  </Modal>
</Container>