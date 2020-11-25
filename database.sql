-- database: weekend-to-do-app

CREATE TABLE tb_task_main (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR (25) NOT NULL,
	"comment" VARCHAR (150) NOT NULL,
	"create_date" DATE NOT NULL, 
	"modified_date" DATE NOT NULL, 
	"due_date" DATE, 
	"completed_date" DATE, 
    "category_color" VARCHAR (10),
    "status" VARCHAR (10) 
); 

DROP TABLE tb_task_main;

SELECT * FROM tb_task_main WHERE id > 0  ORDER BY due_date DESC;
SELECT * FROM tb_task_main WHERE id = 12  ORDER BY due_date ASC;


INSERT INTO tb_task_main ("name","comment","create_date","modified_date","due_date", "completed_date", "category_color", "status") values ('Cut the Grass', 'The grass is getting long, time to cut', '1/1/2020', '1/1/2020', '2/1/2020',null, 'Yellow', 'Open');
INSERT INTO tb_task_main ("name","comment","create_date","modified_date","due_date", "completed_date", "category_color", "status") values ('Wash Car', 'Visit local car wash', '2/1/2020', '2/1/2020', '3/1/2020',null , 'Green', 'Open');
INSERT INTO tb_task_main ("name","comment","create_date","modified_date","due_date", "completed_date", "category_color", "status") values ('Paint Garage', 'Looks great in blue', '3/1/2019', '3/1/2019', '4/1/2019', '12/3/2019', 'Blue', 'Complete');
INSERT INTO tb_task_main ("name","comment","create_date","modified_date","due_date","completed_date", "category_color", "status") values ('Make Bars of Soap', 'Almost out! hurry up.', '4/1/2020', '4/1/2020', '5/1/2020',null , 'Red', 'Open');
INSERT INTO tb_task_main ("name","comment","create_date","modified_date","due_date","completed_date", "category_color", "status") values ('Roast Coffee Beans', 'This week is Ethiopian week', '5/1/2020', '5/1/2020', '6/1/2020',null ,'Green', 'Open');
INSERT INTO tb_task_main ("name","comment","create_date","modified_date","due_date","completed_date", "category_color", "status") values ('Clean Closet', 'Not looking forward to this one', '6/1/2020', '6/1/2020', '7/1/2020',null , 'Yellow', 'Rainy Day');

